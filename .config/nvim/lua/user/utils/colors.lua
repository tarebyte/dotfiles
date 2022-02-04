-- https://github.com/tarebyte/nvim-base16/blob/5f34bccc232b687309b32b53bdf1aab73beeec2b/lua/colors/ocean.lua
local ok, base16 = pcall(require, "base16-colorscheme")
if not ok then
	return {}
end

local theme = (vim.g.colors_name):gsub("base16%p", "")
return require("base16-colorscheme").colorschemes[theme]
