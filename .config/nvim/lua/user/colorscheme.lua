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
end

vim.cmd([[hi @function.builtin gui=italic guifg=]] .. base16_colorscheme.colors.base0C)
vim.cmd([[hi @keyword.return gui=italic guifg=]] .. base16_colorscheme.colors.base0E)
vim.cmd([[hi @method.call gui=italic guifg=]] .. base16_colorscheme.colors.base0D)
vim.cmd([[hi @tag guifg=]] .. base16_colorscheme.colors.base08)
vim.cmd([[hi @tag.attribute gui=italic guifg=]] .. base16_colorscheme.colors.base0A)

vim.cmd([[hi LineNr guifg=]] .. base16_colorscheme.colors.base03)
vim.cmd([[hi SignColumn guifg=]] .. base16_colorscheme.colors.base03 .. [[ guibg=]] .. base16_colorscheme.colors.base00)
vim.cmd([[hi StatusLine guifg=]] .. base16_colorscheme.colors.base04 .. [[ guibg=]] .. base16_colorscheme.colors.base02 .. [[ gui=none]])
vim.cmd([[hi StatusLineNC guifg=]] .. base16_colorscheme.colors.base03 .. [[ guibg=]] .. base16_colorscheme.colors.base01 .. [[ gui=none]])
vim.cmd([[hi VertSplit guifg=]] .. base16_colorscheme.colors.base02 .. [[ guibg=]] .. base16_colorscheme.colors.base02 .. [[ gui=none]])

-- Language specific --

-- HTML
vim.cmd([[hi link @tag.delimiter.html Normal]])

-- Ruby
vim.cmd([[hi link @punctuation.special.ruby Boolean]])
