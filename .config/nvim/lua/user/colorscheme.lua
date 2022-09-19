vim.o.termguicolors = true

local base16 = require("user.utils.base16")

local background = base16.background()
if background ~= nil then
	vim.opt.background = background
end

vim.cmd([[let base16colorspace=256]])

local colorscheme = base16.theme()
if colorscheme ~= nil then
	vim.cmd("colorscheme " .. colorscheme)
end

vim.cmd([[hi TSField guifg=#]] .. vim.g.base16_gui05)
vim.cmd([[hi TSPunctSpecial guifg=#]] .. vim.g.base16_gui0F)
vim.cmd([[hi TSFuncBuiltin cterm=italic gui=italic ctermfg=6 guifg=#]] .. vim.g.base16_gui0C)
