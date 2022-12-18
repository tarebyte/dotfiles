vim.g.conoline_auto_enable = 1

local ok, base16 = pcall(require, "base16-colorscheme")
if not ok then
	return
end

-- Highlight in normal
vim.g.conoline_color_normal_dark = string.format("guibg=%s", base16.colors.base01)
vim.g.conoline_color_normal_nr_dark = string.format("guibg=%s guifg=%s", base16.colors.base00, base16.colors.base07)

-- Hide away on insert.
vim.g.conoline_color_insert_dark = string.format("guibg=%s", base16.colors.base00)
vim.g.conoline_color_insert_nr_dark = string.format("guibg=%s guifg=%s", base16.colors.base00, base16.colors.base07)
