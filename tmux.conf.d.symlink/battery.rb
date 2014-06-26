#!/usr/bin/env ruby
# encoding: utf-8
full    = "●"
empty   = "◦"

heart_count = 5
per_heart = 100/heart_count

v= Hash.new()

ARGF.each do |a|
  if a.start_with? "Now"
    #test for the first line
    if a =~ /'(.*)'/
      v[:source] = $~[1]
    else
      v[:source] = ""
    end
  elsif a.start_with?" -"
    if a =~ /(\d{1,3})%;\s(.*);\s(\d:\d{2}|\(no estimate\))/
      v[:percent] = $~[1].to_i
      v[:state]   = $~[2]
      v[:time]    = $~[3]
    else
      v[:percent] = "0"
      v[:state]   = "unknown"
      v[:time]    = "unknown"
    end
  end
end
outstring = ""

full_hearts  = v[:percent]/per_heart
empty_hearts = heart_count - full_hearts
full_hearts.times  {outstring += "#{full} "}
empty_hearts.times {outstring += "#{empty} "}

# outstring += v[:time] == "0:00" ? " charged" : " #{v[:time]}"

puts outstring
