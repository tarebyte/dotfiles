"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Plug
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

call plug#begin('~/.config/nvim/bundle')

" async execution library - not sure what this is used for.
Plug 'Shougo/vimproc.vim', { 'do': 'make -f make_mac.mak' }

" deprecated apparently. https://github.com/rking/ag.vim
" TODO: not even sure if it's used, though there is config for it.
Plug 'rking/ag.vim'

" styling and themes
Plug 'chriskempson/base16-vim'

" file finding
Plug 'ctrlpvim/ctrlp.vim'

" used with tags - jump to the declaration of an identifier.
" I dont use tags but maybe some day?
Plug 'ivalkeen/vim-ctrlp-tjump'
" python matcher for ctrlp.
Plug 'FelikZ/ctrlp-py-matcher'
" things like indent_style, tab_width, end_of_line, trim_trailing_whitespace,
" max_line_length, etc.
Plug 'editorconfig/editorconfig-vim'

function! DoRemote(arg)
  UpdateRemotePlugins
endfunction

" async keyword completion dropdowns. requires neovim.
Plug 'Shougo/deoplete.nvim', { 'do': function('DoRemote') }

" highlight current window and remove.
" TODO: figure out the key binding for this.
Plug 'junegunn/goyo.vim'

" html autocomplete and syntax
Plug 'othree/html5.vim'

" paranthesis matching with colors
Plug 'kien/rainbow_parentheses.vim'

" for using tab with code completion dropdown
Plug 'ervandew/supertab'

" text alignment
Plug 'godlygeek/tabular'

" browse the tags of the current file and get an overview of its structure
" TODO: try using this some time.
Plug 'majutsushi/tagbar'

" smart comment behavior
Plug 'tomtom/tcomment_vim'

" status bar
Plug 'bling/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" whitespace highlighting
Plug 'ntpeters/vim-better-whitespace'

" language syntax and framework support
Plug 'kchmck/vim-coffee-script'
Plug 'elixir-editors/vim-elixir'
Plug 'fatih/vim-go'
Plug 'jelera/vim-javascript-syntax'
Plug 'elzr/vim-json'
Plug 'vim-ruby/vim-ruby'
Plug 'tpope/vim-markdown'
Plug 'sunaku/vim-ruby-minitest'
Plug 'leafgarland/typescript-vim' " TODO is this working?
" as suggested by dan:
Plug 'cakebaker/scss-syntax.vim'
Plug 'mxw/vim-jsx'
Plug 'JulesWang/css.vim'
Plug 'jparise/vim-graphql'

" frameworks
Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
" requires / integrates with projectionist
Plug 'c-brenn/phoenix.vim'

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Dan's plugins:
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
" Plugin 'pangloss/vim-javascript'
" Plugin 'mxw/vim-jsx'
" Plugin 'cakebaker/scss-syntax.vim'
" Plugin 'leafgarland/typescript-vim'
" Plugin 'JulesWang/css.vim'
" Plugin 'jparise/vim-graphql'
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

" async linting and making. Neovim only.
Plug 'neomake/neomake'

" async linting alternative
" Plug 'w0rp/ale'

" spellcheck - used in markdown and text files.
Plug 'reedes/vim-lexical'

" color scheme.
Plug 'reedes/vim-colors-pencil'

" path navigator
Plug 'justinmk/vim-dirvish'

" TODO: am I using this? might be responsible for some weird double-leader
" bindings that frustrate me?
Plug 'Lokaltog/vim-easymotion'

" adds 'end' in ruby, endfunction/endif/etc
Plug 'tpope/vim-endwise'

" git integration
Plug 'tpope/vim-fugitive'
" shows git diff in the gutter
Plug 'airblade/vim-gitgutter'

" ???
Plug 'itspriddle/vim-marked'

" picking up config in subdirectories I think?
Plug 'tpope/vim-projectionist'

" makes '.' work properly with plugin maps - it'd repeat the last command of
" the plugin otherwise
Plug 'tpope/vim-repeat'

" brackets, quotes, things in pairs...
Plug 'tpope/vim-surround'

" create own text objects
Plug 'kana/vim-textobj-user'
Plug 'nelstrom/vim-textobj-rubyblock'

Plug 'christoomey/vim-tmux-navigator'

call plug#end()

" Required:
filetype plugin indent on
