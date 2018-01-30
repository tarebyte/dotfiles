# frozen_string_literal: true

# Copy the return value of the passed-in block to the system clipboard
# copy { "I am now in the system clipboard" }
def copy
  value = yield
  IO.popen('pbcopy', 'w') do |io|
    io.write(value)
  end
end
