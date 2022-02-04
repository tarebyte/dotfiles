local colors = require("user.utils.colors")

vim.g["ale_fix_on_save"] = 1
vim.g["ale_sign_error"] = ""
vim.g["ale_sign_warning"] = ""
vim.g["ale_virtualtext_cursor"] = 1

vim.cmd([[
	highlight ALEErrorSign guifg=${colors.base08} guibg=${colors.base01}
	highlight ALEVirtualTextError guifg=${colors.base08}
	highlight ALEVirtualTextStyleWarning guifg=${colors.base0A}
	highlight ALEVirtualTextWarning guifg=${colors.base0A}
]])
