" Detect ruby scripts when using shell-ruby
autocmd BufRead *
            \ if getline(1) =~# '^#!.*/usr/bin/env\s\+shell-ruby\>' |
            \     setlocal filetype=ruby |
            \ endif
