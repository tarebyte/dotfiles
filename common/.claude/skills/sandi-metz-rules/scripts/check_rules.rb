#!/usr/bin/env ruby
# frozen_string_literal: true

# Reports Sandi Metz rule violations in Ruby files.
#
#   check_rules.rb FILE...                          # check whole files
#   check_rules.rb --changed [--base REF] [FILE...] # check new and changed code only
#
# In --changed mode, each finding is labeled NEW (the class or def line changed)
# or EXISTING (only lines inside an existing class or method changed).

begin
  require "prism"
rescue LoadError
  warn "check_rules.rb needs Ruby 3.3+ or the prism gem."
  exit 2
end
require "open3"
require "optparse"
require "set"

MAX_CLASS_LINES = 100
MAX_METHOD_LINES = 5
MAX_PARAMS = 4

def git(*args)
  out, status = Open3.capture2("git", *args, err: File::NULL)
  status.success? ? out : nil
end

def default_base
  %w[origin/HEAD origin/main origin/master].each do |ref|
    base = git("merge-base", "HEAD", ref)&.strip
    return base unless base.nil? || base.empty?
  end
  "HEAD"
end

# Returns { path => Set of changed line numbers, or :all for untracked files }.
def changed_lines(base, files)
  result = {}
  current = nil
  (git("diff", "-U0", "--no-color", "--relative", base, "--", *files) || "").each_line do |line|
    if line.start_with?("+++ ")
      path = line.sub(%r{\A\+\+\+ (b/)?}, "").strip
      current = path == "/dev/null" ? nil : path
    elsif current && (m = line.match(/\A@@ -\S+ \+(\d+)(?:,(\d+))? @@/))
      lines = (result[current] ||= Set.new)
      (m[2] || "1").to_i.times { |i| lines << m[1].to_i + i }
    end
  end
  (git("ls-files", "--others", "--exclude-standard", "--", *files) || "").each_line do |path|
    result[path.strip] = :all
  end
  result
end

class IvarCollector < Prism::Visitor
  attr_reader :names

  def initialize
    @names = Set.new
    super
  end

  %i[
    instance_variable_write_node instance_variable_or_write_node instance_variable_and_write_node
    instance_variable_operator_write_node instance_variable_target_node
  ].each do |type|
    define_method("visit_#{type}") do |node|
      @names << node.name.to_s unless node.name.to_s.start_with?("@_")
      super(node)
    end
  end
end

class Checker < Prism::Visitor
  attr_reader :findings

  # touched: nil to check everything, otherwise :all or a Set of changed lines.
  def initialize(path, lines, touched)
    @path = path
    @lines = lines
    @touched = touched
    @findings = []
    super()
  end

  def visit_class_node(node)
    count = code_lines(node.location.start_line + 1, node.location.end_line - 1)
    if count > MAX_CLASS_LINES
      report(node, "rule 1", "class #{node.constant_path.slice} has #{count} lines (max #{MAX_CLASS_LINES})")
    end
    check_controller(node) if @path.end_with?("_controller.rb")
    super
  end

  def visit_def_node(node)
    count = method_lines(node)
    if count > MAX_METHOD_LINES
      report(node, "rule 2", "method #{node.name} has #{count} lines (max #{MAX_METHOD_LINES})")
    end
    params = param_count(node)
    if params > MAX_PARAMS
      report(node, "rule 3", "method #{node.name} takes #{params} parameters (max #{MAX_PARAMS})")
    end
    super
  end

  private

  def check_controller(node)
    return unless node.body.is_a?(Prism::StatementsNode)

    visibility = :public
    node.body.body.each do |stmt|
      if visibility_call?(stmt)
        visibility = stmt.name
      elsif stmt.is_a?(Prism::DefNode) && visibility == :public
        collector = IvarCollector.new
        stmt.accept(collector)
        next if collector.names.size <= 1

        report(stmt, "rule 4", "action #{stmt.name} sets #{collector.names.size} view instance variables " \
                               "(#{collector.names.to_a.join(', ')}); expose one object")
      end
    end
  end

  def visibility_call?(stmt)
    stmt.is_a?(Prism::CallNode) && stmt.receiver.nil? && stmt.arguments.nil? &&
      %i[private protected public].include?(stmt.name)
  end

  def method_lines(node)
    return 1 if node.end_keyword_loc.nil? # endless def

    first = (node.rparen_loc || node.name_loc).start_line + 1
    code_lines(first, node.end_keyword_loc.start_line - 1)
  end

  def param_count(node)
    p = node.parameters or return 0
    p.requireds.size + p.optionals.size + p.posts.size + p.keywords.size +
      (p.rest ? 1 : 0) + (p.keyword_rest ? 1 : 0)
  end

  def code_lines(first, last)
    return 0 if last < first

    @lines[(first - 1)..(last - 1)].count do |line|
      stripped = line.strip
      !stripped.empty? && !stripped.start_with?("#")
    end
  end

  def report(node, rule, message)
    label = status(node)
    return if label == :skip

    @findings << [node.location.start_line, "#{@path}:#{node.location.start_line}: [#{rule}] #{message}#{label}"]
  end

  def status(node)
    return "" if @touched.nil?
    return " (NEW)" if @touched == :all

    first = node.location.start_line
    return " (NEW)" if @touched.include?(first)
    return " (EXISTING)" if (first..node.location.end_line).any? { |n| @touched.include?(n) }

    :skip
  end
end

options = { changed: false, base: nil }
OptionParser.new do |o|
  o.banner = "Usage: check_rules.rb [--changed [--base REF]] [FILE...]"
  o.on("--changed", "Check only new and changed code") { options[:changed] = true }
  o.on("--base REF", "Ref to compare with (default: merge base of the default branch)") { |r| options[:base] = r }
end.parse!

files = ARGV
touched_by_file = nil
if options[:changed]
  touched_by_file = changed_lines(options[:base] || default_base, files)
  files = touched_by_file.keys.select { |f| f.end_with?(".rb") } if files.empty?
end

if files.empty?
  puts "No Ruby files to check."
  exit 0
end

findings = []
files.each do |path|
  next unless File.file?(path)

  touched = touched_by_file && touched_by_file[path]
  next if touched_by_file && touched.nil?

  result = Prism.parse_file(path)
  unless result.errors.empty?
    warn "#{path}: could not parse, skipped"
    next
  end
  checker = Checker.new(path, File.readlines(path), touched)
  result.value.accept(checker)
  findings.concat(checker.findings.sort_by(&:first).map(&:last))
end

if findings.empty?
  puts "No rule violations found."
else
  puts findings
end
