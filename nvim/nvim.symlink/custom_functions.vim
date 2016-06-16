"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Writing
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! s:goyo_enter()
  set background=light

  colorscheme pencil

  let g:goyo_width=85
  set guifont=Cousine:h15
  set wrap
  set linespace=8

  setlocal spell spelllang=en_us
endfunction

function! s:goyo_leave()
  set background=dark
  colorscheme base16-ocean

  set guifont=Hack\ Regular:h13
  set nowrap
  set linespace=1

  set nospell
endfunction

autocmd User GoyoEnter nested call <SID>goyo_enter()
autocmd User GoyoLeave nested call <SID>goyo_leave()

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Vim Modeline
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Append modeline after last line in buffer.
" Use substitute() instead of printf() to handle '%%s' modeline in LaTeX
" files.
function! AppendModeline()
  let l:modeline = printf(" vim: set ts=%d sw=%d tw=%d %set :",
        \ &tabstop, &shiftwidth, &textwidth, &expandtab ? '' : 'no')
  let l:modeline = substitute(&commentstring, "%s", l:modeline, "")
  call append(line("$"), l:modeline)
endfunction
nnoremap <silent> <Leader>ml :call AppendModeline()<CR>
