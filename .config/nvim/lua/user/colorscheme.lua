vim.o.termguicolors = true

local base16 = require("user.utils.base16")

local background = base16.background()
if background ~= nil then
	vim.opt.background = background
end

local ok, base16_colorscheme = pcall(require, "base16-colorscheme")
if not ok then
	return
end

base16_colorscheme.with_config({
	telescope = false,
})

local colorscheme = base16.theme()
if colorscheme ~= nil then
	vim.cmd("colorscheme " .. colorscheme)

	local scheme = string.gsub(colorscheme, "base16%-", "")

	-- Load color helpers into global
	for k, v in pairs(base16_colorscheme.colorschemes[scheme]) do
		local key = "base16_gui" .. string.gsub(k, "base", "")
		vim.g[key] = v
	end
end

vim.cmd([[hi @function.builtin cterm=italic gui=italic ctermfg=6 guifg=]] .. vim.g.base16_gui0C)
vim.cmd([[hi @tag guifg=]] .. vim.g.base16_gui08)

vim.cmd([[hi LineNr guifg=]] .. vim.g.base16_gui03)
vim.cmd([[hi SignColumn guifg=]] .. vim.g.base16_gui03 .. [[ guibg=]] .. vim.g.base16_gui00)
vim.cmd([[hi StatusLine guifg=]] .. vim.g.base16_gui04 .. [[ guibg=]] .. vim.g.base16_gui02 .. [[ gui=none]])
vim.cmd([[hi StatusLineNC guifg=]] .. vim.g.base16_gui03 .. [[ guibg=]] .. vim.g.base16_gui01 .. [[ gui=none]])
vim.cmd([[hi VertSplit guifg=]] .. vim.g.base16_gui02 .. [[ guibg=]] .. vim.g.base16_gui02 .. [[ gui=none]])

-- Language specific --

-- HTML
vim.cmd([[hi link @tag.delimiter.html Normal]])

-- Ruby
vim.cmd([[hi link @punctuation.special.ruby Boolean]])
