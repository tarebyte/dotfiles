
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" File types
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
au BufNewFile,BufRead *.coffee set filetype=coffee
au BufRead,BufNewFile {Gemfile,Rakefile,Vagrantfile,Thorfile,config.ru,Brewfile} set ft=ruby
au BufNewFile,BufRead *.es6 set filetype=javascript
" au BufNewFile,BufRead *.json set ai filetype=javascript
au BufNewFile,BufRead *.pp set filetype=puppet
au BufNewFile,BufRead *.boot set filetype=clojure

augroup mkd
  autocmd BufNewFile,BufRead *.mkd      set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
  autocmd BufNewFile,BufRead *.md       set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
  autocmd BufNewFile,BufRead *.markdown set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
augroup END
