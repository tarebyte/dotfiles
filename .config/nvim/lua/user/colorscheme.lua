vim.o.termguicolors = true

local ok, _ = pcall(require, "base16-colorscheme")
if not ok then
	return
end

local base16 = require("user.utils.base16")

local background = base16.background()
if background ~= nil then
	vim.opt.background = background
end

local colorscheme = base16.theme()
if colorscheme ~= nil then
	vim.cmd("colorscheme " .. colorscheme)
end

local colors = require("user.utils.colors")
if colors.loaded then
	local hi = colors.highlight

	-- Overrides to more inline with https://github.com/chriskempson/base16-vim
	hi.LineNr = { guifg = colors.base03, guibg = colors.base01, gui = nil, guisp = nil }
	hi.SignColumn = { guifg = colors.base03, guibg = colors.base01, gui = nil, guisp = nil }
	hi.StatusLine = { guifg = colors.base04, guibg = colors.base02, gui = "none", guisp = nil }
	hi.StatusLineNC = { guifg = colors.base03, guibg = colors.base01, gui = "none", guisp = nil }
	hi.VertSplit = { guifg = colors.base02, guibg = colors.base02, gui = "none", guisp = nil }
end
