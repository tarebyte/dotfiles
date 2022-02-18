vim.o.termguicolors = true

local ok, _ = pcall(require, "base16-colorscheme")
if not ok then
	return
end

base16 = require("user.utils.base16")

local background = base16.background()
if background ~= nil then
	vim.opt.background = background
end

local colorscheme = base16.theme()
if colorscheme ~= nil then
	vim.cmd("colorscheme " .. colorscheme)
end
