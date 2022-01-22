-- Looking for ale_disable_lsp ? It's in config/nvim/init.lua
vim.g['ale_fix_on_save'] = 1
vim.g['ale_virtualtext_cursor'] = 1

vim.cmd('highlight ALEWarning gui=underline')
vim.cmd('highlight ALEVirtualTextError guifg=#BF616A') -- red
vim.cmd('highlight ALEVirtualTextWarning guifg=#EBCB8B') -- yellow
vim.cmd('highlight ALEVirtualTextStyleWarning guifg=#EBCB8B') -- yellow
