vim.g["ale_fix_on_save"] = 1
vim.g["ale_sign_error"] = ""
vim.g["ale_sign_warning"] = ""
vim.g["ale_virtualtext_cursor"] = 1

vim.cmd([[
	highlight ALEErrorSign guifg=#BF616A guibg=#343D46
	highlight ALEVirtualTextError guifg=#BF616A
	highlight ALEVirtualTextStyleWarning guifg=#EBCB8B
	highlight ALEVirtualTextWarning guifg=#EBCB8B
]])
