# frozen_string_literal: true

%w[awesome_print].each do |gem|
  begin
    require gem
  rescue StandardError => e
    puts e.message
  end
end
