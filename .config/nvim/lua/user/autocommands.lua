vim.cmd('au BufReadPost * if line("\'\\"") > 1 && line("\'\\"") < line("$") | exe "normal! g\'\\"" | endif')

vim.cmd([[
	" Create a search command that uses Ripgrep and offers previews
	command! -bang -complete=file -nargs=* Search
	\ call fzf#vim#grep(
	\   'rg --smart-case --vimgrep --no-heading --color=always '.<q-args>, 1,
	\   <bang>0 ? fzf#vim#with_preview('up:60%')
	\           : fzf#vim#with_preview('right:50%:hidden', '?'),
	\   <bang>0)
]])
