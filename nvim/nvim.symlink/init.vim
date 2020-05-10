call plug#begin('~/.config/nvim/bundle')

Plug 'Shougo/vimproc.vim', { 'do': 'make -f make_mac.mak' }

Plug 'slashmili/alchemist.vim'
Plug 'w0rp/ale'

Plug 'chriskempson/base16-vim'

if has('nvim')
  Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
else
  Plug 'Shougo/deoplete.nvim'
  Plug 'roxma/nvim-yarp'
  Plug 'roxma/vim-hug-neovim-rpc'
endif

Plug 'zchee/deoplete-go', { 'do': 'make'}

Plug '/usr/local/opt/fzf' | Plug 'junegunn/fzf.vim'

Plug 'jparise/vim-graphql'

Plug 'kien/rainbow_parentheses.vim'
Plug 'danro/rename.vim'

Plug 'cakebaker/scss-syntax.vim'
Plug 'ervandew/supertab'

Plug 'godlygeek/tabular'
Plug 'majutsushi/tagbar'
Plug 'tomtom/tcomment_vim'
Plug 'leafgarland/typescript-vim'

Plug 'bling/vim-airline'
Plug 'vim-airline/vim-airline-themes'

Plug 'ntpeters/vim-better-whitespace'

Plug 'justinmk/vim-dirvish'
Plug 'kristijanhusak/vim-dirvish-git'

Plug 'Lokaltog/vim-easymotion'
Plug 'elixir-editors/vim-elixir'
Plug 'tpope/vim-endwise'

Plug 'dag/vim-fish'
Plug 'tpope/vim-fugitive'

Plug 'airblade/vim-gitgutter'
Plug 'fatih/vim-go', { 'do': ':GoInstallBinaries' }

Plug 'pangloss/vim-javascript'

Plug 'tpope/vim-projectionist'

Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
Plug 'tpope/vim-rbenv'
Plug 'tpope/vim-bundler'
Plug 'tpope/vim-repeat'
Plug 'vim-ruby/vim-ruby'
Plug 'sunaku/vim-ruby-minitest'

Plug 'tpope/vim-surround'

Plug 'kana/vim-textobj-user'
Plug 'nelstrom/vim-textobj-rubyblock'
Plug 'christoomey/vim-tmux-navigator'

Plug 'terryma/vim-multiple-cursors'

Plug 'ludovicchabant/vim-gutentags'
Plug 'tpope/vim-rhubarb'

Plug 'RRethy/vim-illuminate'
Plug 'joker1007/vim-ruby-heredoc-syntax'

Plug 'vimwiki/vimwiki'

call plug#end()

" Required:
filetype plugin indent on

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Settings
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" required for several plugins
set nocompatible

" required for like, everything
if has("autocmd")
  filetype indent plugin on
endif

" set pwd to current directory
cd $PWD

" enable syntax highlighting
syntax on

" set colors to 256
set t_Co=256

" True colors
let $NVIM_TUI_ENABLE_TRUE_COLOR=1

" default color scheme
let base16colorspace=256
set background=dark
colorscheme base16-ocean

" Extra fun stuff
highlight Comment cterm=italic
highlight Function cterm=bold

" don't wrap long lines
set nowrap

" show commands as we type them
set showcmd

" highlight matching brackets
set showmatch

" scroll the window when we get near the edge
set scrolloff=4 sidescrolloff=10

" use 2 spaces for tabs
set expandtab tabstop=2 softtabstop=2 shiftwidth=2
set smarttab

" enable line numbers, and don't make them any wider than necessary
set number numberwidth=2

" show the first match as search strings are typed
set incsearch

" highlight the search matches
set hlsearch

" searching is case insensitive when all lowercase
set ignorecase smartcase

" assume the /g flag on substitutions to replace all matches in a line
set gdefault

" set temporary directory (don't litter local dir with swp/tmp files)
set directory=/tmp/

" pick up external file modifications
set autoread

" don't abandon buffers when unloading
set hidden

" match indentation of previous line
set autoindent

" don't blink the cursor
set guicursor=a:blinkon0

" show current line info (current/total)
set ruler rulerformat=%=%l/%L

" show status line
set laststatus=2

" When lines are cropped at the screen bottom, show as much as possible
set display=lastline

" flip the default split directions to sane ones
set splitright
set splitbelow

" don't beep for errors
set visualbell

" make backspace work in insert mode
set backspace=indent,eol,start

" highlight trailing whitespace
set listchars=tab:>\ ,trail:-,extends:>,precedes:<,nbsp:+
set list

" use tab-complete to see a list of possiblities when entering commands
set wildmode=list:longest,full

" allow lots of tabs
set tabpagemax=20

" remember last position in file
if has("autocmd")
  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif

" Set gitcommit from thoughtbot
autocmd Filetype gitcommit setlocal spell textwidth=72

" When the type of shell script is /bin/sh, assume a POSIX-compatible
" shell for syntax highlighting purposes.
let g:is_posix = 1

" Use system clipboard
set clipboard=unnamed

" Turn it up
hi Number ctermfg=16

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Keybindings
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Remap leader to ,
let mapleader = ","
let g:mapleader = ","

" easy wrap toggling
nmap <Leader>w :set wrap!<cr>
nmap <Leader>W :set nowrap<cr>

" shortcut to save all
nmap <Leader>ss :wa<cr>

" close all other windows (in the current tab)
nmap gW :only<cr>

" go to the alternate file (previous buffer) with g-enter
nmap g 

map <Leader>s :Search<Space>

" insert blank lines without going into insert mode
nmap go o<esc>
nmap gO O<esc>

" mapping the jumping between splits. Hold control while using vim nav.
nmap <C-J> <C-W>j
nmap <C-K> <C-W>k
nmap <C-H> <C-W>h
nmap <C-L> <C-W>l

" Yank from the cursor to the end of the line, to be consistent with C and D.
nnoremap Y y$

" clean up trailing whitespace
" map <Leader>c :StripTrailingWhitespaces<cr>
map <Leader>c :StripWhitespace<cr>

" delete all buffers
map <Leader>d :bufdo bd<cr>

" map spacebar to clear search highlight
nnoremap <Leader><space> :noh<cr>

" reindent the entire file
map <Leader>I gg=G``<cr>

" insert the path of currently edited file into a command
" Command mode: Ctrl-P
cmap <C-S-P> <C-R>=expand("%:p:h") . "/" <cr>

" jump to far right or left of line
map L $
map H ^

" Open .vimrc
nnoremap <leader>v :e  ~/.vimrc<CR>
map <silent> <leader>vs :source ~/.vimrc<CR>:filetype detect<CR>:exe ":echo 'vimrc reloaded!'"<CR>

" Fast saving
map <Esc><Esc> :w<CR>
map <leader>w :w<CR>
inoremap jk <esc>

" Fast access to : commands
nnoremap <Space> :

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Keybindings
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
au BufRead,BufNewFile {Gemfile,Rakefile,Vagrantfile,Thorfile,config.ru,Brewfile,.Brewfile} set ft=ruby

au BufNewFile,BufRead *.coffee    set filetype=coffee
au BufNewFile,BufRead *.es6       set filetype=javascript
au BufNewFile,BufRead *.babelrc   set filetype=json
au BufNewFile,BufRead *.pp        set filetype=puppet
au BufNewFile,BufRead *.boot      set filetype=clojure
au BufNewFile,BufRead *.graphcool set filetype=graphql

autocmd FileType make set noexpandtab
autocmd FileType xml set noexpandtab

augroup mkd
  autocmd BufNewFile,BufRead *.mkd      set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
  autocmd BufNewFile,BufRead *.md       set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
  autocmd BufNewFile,BufRead *.markdown set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
augroup END


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Plugins
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" ==================== Ale ====================
let g:airline#extensions#ale#enabled = 1
let g:ale_virtualtext_cursor = 1
let g:ale_fix_on_save = 1

highlight ALEWarning cterm=underline
highlight ALEVirtualTextError ctermfg=red
highlight ALEVirtualTextWarning ctermfg=yellow
highlight ALEVirtualTextStyleError ctermfg=red
highlight ALEVirtualTextStyleWarning ctermfg=yellow

" ==================== Deoplete ====================
" https://github.com/zchee/deoplete-go#sample-initvim
set completeopt+=noselect

" Path to python interpreter for neovim
let g:python3_host_prog  = '/usr/local/bin/python3'

" Skip the check of neovim module
let g:python3_host_skip_check = 1

" Run deoplete.nvim automatically
let g:deoplete#enable_at_startup = 1

" deoplete-go settings
let g:deoplete#sources#go#gocode_binary = $GOPATH.'/bin/gocode'
let g:deoplete#sources#go#sort_class = ['package', 'func', 'type', 'var', 'const']

" ==================== FZF ====================
nnoremap <C-p> :FZF<CR>
nmap <leader>t :FZF<CR>
nmap <leader>b :Buffers<CR>

" Make jump to tag open up FZF
nnoremap <c-]> :Tags <c-r><c-w><cr>

" Create a search command that uses Ripgrep and offers previews
command! -bang -complete=file -nargs=* Search
  \ call fzf#vim#grep(
  \   'rg --column --line-number --no-heading --color=always '.<q-args>, 1,
  \   <bang>0 ? fzf#vim#with_preview('up:60%')
  \           : fzf#vim#with_preview('right:50%:hidden', '?'),
  \   <bang>0)

" ==================== Gutentags ====================
let g:gutentags_file_list_command = "rg --files"

" ==================== Rainbow Parentheses ====================
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

" ==================== Tabular ====================
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

" ==================== Tagbar ====================
let g:tagbar_autofocus = 1
map <Leader>rt :!ctags --extra=+f -R *<CR><CR>
map <Leader>. :TagbarToggle<CR>

" ==================== Vim Airline ====================
let g:airline_theme = "base16"
let g:airline_powerline_fonts = 1
let g:airline#extensions#hunks#enabled = 0

if !exists('g:airline_symbols')
  let g:airline_symbols = {}
endif

let g:airline_left_sep = ''
let g:airline_right_sep = ''

" ==================== Vim Better Whitespace ====================
highlight ExtraWhitespace ctermbg=bg

" ==================== Vim Dirvish Git ====================
let g:dirvish_git_show_ignored = 1

" ==================== Vim Go ====================
autocmd FileType go nmap <leader>gb  <Plug>(go-build)
autocmd FileType go nmap <leader>gr  <Plug>(go-run)
autocmd FileType go nmap <leader>gt  <Plug>(go-test)

let g:go_highlight_build_constraints = 1
let g:go_highlight_extra_types = 1
let g:go_highlight_fields = 1
let g:go_highlight_functions = 1
let g:go_highlight_methods = 1
let g:go_highlight_operators = 1
let g:go_highlight_structs = 1
let g:go_highlight_types = 1

" ==================== Vim Heredoc Ruby Syntax ====================
let g:ruby_heredoc_syntax_filetypes = { "graphql" : { "start" : "GRAPHQL", }, }

" ==================== Vim Minitest ====================
set completefunc=syntaxcomplete#Complete

" ==================== Vim TextObc Ruby Block ====================
runtime macros/matchit.vim

" ==================== Vim TMUX ====================
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
