# vim:ft=ruby ts=2 sw=2 sts=2

# frozen_string_literal: true

# Aliases
Pry.commands.alias_command 'e', 'exit'
Pry.commands.alias_command 'q', 'exit-program'
Pry.commands.alias_command 'w', 'whereami'

if defined?(PryByebug)
  Pry.commands.alias_command 'c', 'continue'
  Pry.commands.alias_command 's', 'step'
  Pry.commands.alias_command 'n', 'next'
  Pry.commands.alias_command 'f', 'finish'
end

# Style
Pry.config.editor = 'nvim'
Pry.config.prompt = [
  proc { '>> ' },
  proc { '|  ' }
]

# Grab the clipboard
def pbcopy(str)
  IO.popen('pbcopy', 'r+') { |io| io.puts str }
  output.puts '-- Copy to clipboard --\n#{str}' # rubocop:disable Lint/InterpolationCheck
end

Pry.config.commands.command 'hiscopy', 'History copy to clipboard' do |n|
  pbcopy _pry_.input_array[n ? n.to_i : -1]
end

Pry.config.commands.command 'copy', 'Copy to clipboard' do |str|
  str ||= "#{_pry_.input_array[-1]}#=> #{_pry_.last_result}\n"
  pbcopy str
end

Pry.config.commands.command 'lastcopy', 'Last result copy to clipboard' do
  pbcopy _pry_.last_result.chomp
end
