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

vim.cmd([[hi link @variable Identifier]])
vim.cmd([[hi @function.builtin cterm=italic gui=italic ctermfg=6 guifg=#]] .. vim.g.base16_gui0C)

-- Ruby specific
vim.cmd([[hi link @field.ruby Normal]])
vim.cmd([[hi link @punctuation.special.ruby rubyInterpolationDelimiter]])
vim.cmd([[hi link @symbol.ruby rubySymbol]])
vim.cmd([[hi link @variable.builtin.ruby Debug]])
