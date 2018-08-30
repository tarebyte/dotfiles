"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Plug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

call plug#begin('~/.config/nvim/bundle')

Plug 'Shougo/vimproc.vim', { 'do': 'make -f make_mac.mak' }

Plug 'slashmili/alchemist.vim'

Plug 'w0rp/ale'

Plug 'chriskempson/base16-vim'

Plug 'editorconfig/editorconfig-vim'

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

Plug 'bling/vim-airline'
Plug 'vim-airline/vim-airline-themes'

Plug 'ntpeters/vim-better-whitespace'

Plug 'justinmk/vim-dirvish'
Plug 'kristijanhusak/vim-dirvish-git'

Plug 'dag/vim-fish'
Plug 'Lokaltog/vim-easymotion'
Plug 'tpope/vim-endwise'

Plug 'tpope/vim-fugitive'

Plug 'airblade/vim-gitgutter'
Plug 'fatih/vim-go', { 'do': ':GoInstallBinaries' }

Plug 'pangloss/vim-javascript'

Plug 'reedes/vim-lexical'

Plug 'tpope/vim-projectionist'

Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
Plug 'tpope/vim-rbenv'
Plug 'rust-lang/rust.vim'
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

call plug#end()

" Required:
filetype plugin indent on
