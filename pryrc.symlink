# Load all of the configs
def require_rb_files_from(dir)
  Dir.glob(File.join(dir, '*.rb')) do |file|
      require file
    end
  end

require_rb_files_from(File.join(ENV['HOME'], '.pryrc.d'))

Pry.config.editor = "vim"
Pry.config.prompt = [ proc { ">> " },
                      proc { "|  " }]
