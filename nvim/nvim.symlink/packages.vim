"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Plug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

call plug#begin('~/.config/nvim/bundle')

Plug 'Shougo/vimproc.vim', { 'do': 'make -f make_mac.mak' }

Plug 'rking/ag.vim'

Plug 'chriskempson/base16-vim'

Plug 'ctrlpvim/ctrlp.vim'
Plug 'ivalkeen/vim-ctrlp-tjump'
Plug 'FelikZ/ctrlp-py-matcher'

Plug 'editorconfig/editorconfig-vim'

function! DoRemote(arg)
  UpdateRemotePlugins
endfunction

Plug 'Shougo/deoplete.nvim', { 'do': function('DoRemote') }

Plug 'junegunn/goyo.vim'

Plug 'othree/html5.vim'

Plug 'neomake/neomake'

Plug 'kien/rainbow_parentheses.vim'

Plug 'ervandew/supertab'

Plug 'godlygeek/tabular'
Plug 'majutsushi/tagbar'
Plug 'tomtom/tcomment_vim'

Plug 'bling/vim-airline'
Plug 'vim-airline/vim-airline-themes'

Plug 'ntpeters/vim-better-whitespace'

Plug 'kchmck/vim-coffee-script'
Plug 'reedes/vim-colors-pencil'

Plug 'justinmk/vim-dirvish'

Plug 'Lokaltog/vim-easymotion'
Plug 'elixir-lang/vim-elixir'
Plug 'tpope/vim-endwise'

Plug 'tpope/vim-fugitive'

Plug 'airblade/vim-gitgutter'
Plug 'fatih/vim-go'

Plug 'jelera/vim-javascript-syntax'
Plug 'elzr/vim-json'

Plug 'itspriddle/vim-marked'
Plug 'tpope/vim-markdown'

Plug 'reedes/vim-lexical'

Plug 'tpope/vim-projectionist'

Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
Plug 'tpope/vim-repeat'
Plug 'vim-ruby/vim-ruby'
Plug 'sunaku/vim-ruby-minitest'

Plug 'tpope/vim-surround'

Plug 'kana/vim-textobj-user'
Plug 'nelstrom/vim-textobj-rubyblock'
Plug 'christoomey/vim-tmux-navigator'
Plug 'leafgarland/typescript-vim'

call plug#end()

" Required:
filetype plugin indent on
