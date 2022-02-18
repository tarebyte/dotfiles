base16 = require("user.utils.base16")

vim.o.termguicolors = true

vim.opt.background = base16.background()
vim.cmd("colorscheme " .. base16.theme())
