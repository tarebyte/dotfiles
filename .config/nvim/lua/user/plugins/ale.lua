vim.g["ale_fix_on_save"] = 1
vim.g["ale_sign_error"] = " "
vim.g["ale_sign_warning"] = ""
vim.g["ale_virtualtext_cursor"] = 1
vim.g["ale_virtualtext_prefix"] = " "

local colors = require("user.utils.colors")
if not colors.loaded then
	return
end

vim.cmd([[highlight ALEErrorSign guifg=]] .. colors.base08 .. [[ guibg=]] .. colors.base00)
vim.cmd([[highlight ALEVirtualTextError guifg=]] .. colors.base08)
vim.cmd([[highlight ALEVirtualTextStyleWarning guifg=]] .. colors.base0A)
vim.cmd([[highlight ALEVirtualTextWarning guifg=]] .. colors.base0A)
vim.cmd([[highlight ALEWarningSign guifg=]] .. colors.base0A .. [[ guibg=]] .. colors.base00)
