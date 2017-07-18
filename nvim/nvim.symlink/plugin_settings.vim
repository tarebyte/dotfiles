"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"
" Plugin settings
"
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" vim-better-whitespace
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
highlight ExtraWhitespace ctermbg=bg

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" vim-airline
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:airline_powerline_fonts = 1
let g:airline_theme = "base16"

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" ctrlp.vim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
nmap <leader>t :CtrlP<CR>
nmap <leader>b :CtrlPBuffer<CR>
nmap <leader>r :CtrlPMRU<CR>
nmap <leader>T :CtrlPClearCache<CR>:CtrlP<CR>
nnoremap <leader>. :CtrlPTag<cr>

let g:ctrlp_tjump_only_silent = 1 " jump immediately if only one tag
nnoremap <c-]> :CtrlPtjump<cr>
vnoremap <c-]> :CtrlPtjumpVisual<cr>

" https://github.com/kien/ctrlp.vim/blob/master/doc/ctrlp.txt
let g:ctrlp_match_func = { 'match': 'pymatcher#PyMatch' }
let g:ctrlp_working_path_mode = 'r'
" let g:ctrlp_user_command = 'ag %s -i --nocolor --nogroup -g ""'
let g:ctrlp_user_command = 'cd %s && git ls-files . -co --exclude-standard'

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" rainbow_parentheses.vim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:rbpt_colorpairs = [
      \ [ '13', '#6c71c4'],
      \ [ '5',  '#d33682'],
      \ [ '1',  '#dc322f'],
      \ [ '9',  '#cb4b16'],
      \ [ '3',  '#b58900'],
      \ [ '2',  '#859900'],
      \ [ '6',  '#2aa198'],
      \ [ '4',  '#268bd2'],
      \ ]

au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Neomake
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
autocmd! BufWritePost * Neomake
let g:neomake_error_sign = { 'text': 'E>', 'texthl': 'ErrorMsg' }

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" tabular
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! CustomTabularPatterns()
  if exists('g:tabular_loaded')
    AddTabularPattern! symbols         / :/l0
    AddTabularPattern! hash            /^[^>]*\zs=>/
    AddTabularPattern! chunks          / \S\+/l0
    AddTabularPattern! assignment      / = /l0
    AddTabularPattern! comma           /^[^,]*,/l1
    AddTabularPattern! colon           /:\zs /l0
    AddTabularPattern! options_hashes  /:\w\+ =>/
  endif
endfunction

autocmd VimEnter * call CustomTabularPatterns()

" shortcut to align text with Tabular
map <Leader>a :Tabularize<space>

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" tagbar
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:tagbar_autofocus = 1
map <Leader>rt :!ctags --extra=+f -R *<CR><CR>
map <Leader>. :TagbarToggle<CR>

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" ag.vim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
nmap <leader>ag :Ag<space>
let g:ackprg = 'ag --vimgrep'

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" deoplete.nvim
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:deoplete#enable_at_startup = 1

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Lexical
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
augroup lexical
  autocmd!
  autocmd FileType markdown,mkd call lexical#init()
  autocmd FileType textile call lexical#init()
  autocmd FileType text call lexical#init
augroup END

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Vim Tmux Navigator
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
let g:tmux_is_last_pane = 0
au WinEnter * let g:tmux_is_last_pane = 0

" Like `wincmd` but also change tmux panes instead of vim windows when needed.
function! TmuxWinCmd(direction)
  let nr = winnr()
  let tmux_last_pane = (a:direction == 'p' && g:tmux_is_last_pane)
  if !tmux_last_pane
    " try to switch windows within vim
    exec 'wincmd ' . a:direction
  endif
  " Forward the switch panes command to tmux if:
  " a) we're toggling between the last tmux pane;
  " b) we tried switching windows in vim but it didn't have effect.
  if tmux_last_pane || nr == winnr()
    let cmd = 'tmux select-pane -' . tr(a:direction, 'phjkl', 'lLDUR')
    call system(cmd)
    redraw! " because `exec` fucked up the screen. why is this needed?? arrghh
    let g:tmux_is_last_pane = 1
  else
    let g:tmux_is_last_pane = 0
  endif
endfunction

" navigate between split windows/tmux panes
nmap <c-j> :call TmuxWinCmd('j')<cr>
nmap <c-k> :call TmuxWinCmd('k')<cr>
nmap <c-h> :call TmuxWinCmd('h')<cr>
nmap <c-l> :call TmuxWinCmd('l')<cr>
nmap <c-\> :call TmuxWinCmd('p')<cr>
