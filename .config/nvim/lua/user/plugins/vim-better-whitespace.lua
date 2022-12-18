local ok, base16 = pcall(require, "base16-colorscheme")
if not ok then
	return
end

vim.cmd(
	[[highlight ExtraWhitespace ctermbg=red ctermfg=white guibg=]]
		.. base16.colors.base08
		.. [[ guifg=]]
		.. base16.colors.base05
)
