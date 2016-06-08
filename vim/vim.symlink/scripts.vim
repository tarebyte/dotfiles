if did_filetype()
  finish
endif
if getline(1) =~# '^#!.*/usr/bin/env\s\+shell-ruby\>'
  setfiletype ruby
endif
