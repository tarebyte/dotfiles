vim.g.conoline_auto_enable = 1

-- Highlight in normal
vim.g.conoline_color_normal_dark = string.format("guibg=#%s", vim.g.base16_gui01)
vim.g.conoline_color_normal_nr_dark = string.format("guibg=#%s guifg=#%s", vim.g.base16_gui00, vim.g.base16_gui07)

-- Hide away on insert.
vim.g.conoline_color_insert_dark = string.format("guibg=#%s", vim.g.base16_gui00)
vim.g.conoline_color_insert_nr_dark = string.format("guibg=#%s guifg=#%s", vim.g.base16_gui00, vim.g.base16_gui07)
