" Plugins are managed by Vundle. Once VIM is open run :BundleInstall to
" install plugins.

" Plugins requiring no additional configuration or keymaps
  Bundle 'altercation/vim-colors-solarized'
  Bundle 'tpope/vim-endwise'
  Bundle 'tpope/vim-fugitive'
  Bundle 'tpope/vim-haml'
  Bundle 'vim-ruby/vim-ruby'
  Bundle 'ervandew/supertab'
  Bundle 'tomtom/tcomment_vim'
  Bundle 'kana/vim-textobj-user'
  Bundle 'nelstrom/vim-textobj-rubyblock'
  Bundle 'tpope/vim-repeat'
  Bundle 'bling/vim-airline'
  Bundle 'chriskempson/base16-vim'
  Bundle 'edkolev/tmuxline.vim'

" Rainbow Parentheses
  Bundle 'kien/rainbow_parentheses.vim'
    au VimEnter * RainbowParenthesesToggle
    au Syntax * RainbowParenthesesLoadRound
    au Syntax * RainbowParenthesesLoadSquare
    au Syntax * RainbowParenthesesLoadBraces

" Javascript
  Bundle 'pangloss/vim-javascript'
    au BufNewFile,BufRead *.es6 set filetype=javascript

" CtrlP - with FuzzyFinder compatible keymaps
  Bundle 'kien/ctrlp.vim'
    nnoremap <Leader>b :<C-U>CtrlPBuffer<CR>
    nnoremap <Leader>t :<C-U>CtrlP<CR>
    nnoremap <Leader>T :<C-U>CtrlPTag<CR>
    let g:ctrlp_prompt_mappings = {
        \ 'PrtSelectMove("j")':   ['<down>'],
        \ 'PrtSelectMove("k")':   ['<up>'],
        \ 'AcceptSelection("h")': ['<c-j>'],
        \ 'AcceptSelection("v")': ['<c-k>', '<RightMouse>'],
        \ }
    " respect the .gitignore
    let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files . --cached --exclude-standard --others']

" Slim
  Bundle 'slim-template/vim-slim'
    au BufNewFile,BufRead *.slim set filetype=slim

" Handlebars
  Bundle 'nono/vim-handlebars'
    au BufNewFile,BufRead *.hbs set filetype=handlebars

" Coffee script
  Bundle 'kchmck/vim-coffee-script'
    au BufNewFile,BufRead *.coffee set filetype=coffee

" Tagbar for navigation by tags using CTags
  Bundle 'majutsushi/tagbar'
    let g:tagbar_autofocus = 1
    map <Leader>rt :!ctags --extra=+f -R *<CR><CR>
    map <Leader>. :TagbarToggle<CR>

" Markdown syntax highlighting
  Bundle 'tpope/vim-markdown'
    augroup mkd
      autocmd BufNewFile,BufRead *.mkd      set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
      autocmd BufNewFile,BufRead *.md       set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
      autocmd BufNewFile,BufRead *.markdown set ai formatoptions=tcroqn2 comments=n:> filetype=markdown
    augroup END

" NERDTree for project drawer
  Bundle 'scrooloose/nerdtree'
    let NERDTreeHijackNetrw = 0

    nmap gt :NERDTreeToggle<CR>
    nmap g :NERDTree \| NERDTreeToggle \| NERDTreeFind<CR>

" Tabular for aligning text
  Bundle 'godlygeek/tabular'
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

" Syntastic for catching syntax errors on save
  Bundle 'scrooloose/syntastic'
    let g:syntastic_enable_signs=1
    let g:syntastic_quiet_messages = {'level': 'warning'}
    " syntastic is too slow for haml and sass
    let g:syntastic_mode_map = { 'mode': 'active',
                               \ 'active_filetypes': [],
                               \ 'passive_filetypes': ['haml','scss','sass'] }

" gundo for awesome undo tree visualization
  Bundle 'sjl/gundo.vim'
    map <Leader>h :GundoToggle<CR>

" rails.vim, nuff' said
  Bundle 'tpope/vim-rails'
    map <Leader>oc :Rcontroller<Space>
    map <Leader>ov :Rview<Space>
    map <Leader>om :Rmodel<Space>
    map <Leader>oh :Rhelper<Space>
    map <Leader>oj :Rjavascript<Space>
    map <Leader>os :Rstylesheet<Space>
    map <Leader>oi :Rintegration<Space>

" surround for adding surround 'physics'
  Bundle 'tpope/vim-surround'
    " # to surround with ruby string interpolation
    let g:surround_35 = "#{\r}"
    " - to surround with no-output erb tag
    let g:surround_45 = "<% \r %>"
    " = to surround with output erb tag
    let g:surround_61 = "<%= \r %>"

" Easy Motion
Bundle 'Lokaltog/vim-easymotion'
  map <Leader> <Plug>(easymotion-prefix)

" Puppet
Bundle 'rodjek/vim-puppet'
  au BufNewFile,BufRead *.pp set filetype=puppet
