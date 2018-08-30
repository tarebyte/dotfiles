let g:airline_theme = "base16"
let g:airline_powerline_fonts = 0
let g:airline#extensions#hunks#enabled = 0

if !exists('g:airline_symbols')
  let g:airline_symbols = {}
endif

" Requires github-octicons font
" as Non-ASCII font
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
let g:airline_symbols.linenr = ''
let g:airline_symbols.maxlinenr = '  '
