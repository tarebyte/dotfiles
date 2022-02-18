local M = {}

M.loaded = false

-- https://github.com/tarebyte/nvim-base16/blob/5f34bccc232b687309b32b53bdf1aab73beeec2b/lua/colors/ocean.lua
local ok, base16 = pcall(require, "base16-colorscheme")
if ok then
	if vim.g.colors_name ~= nil then
		local theme = (vim.g.colors_name):gsub("base16%p", "")
		M = require("base16-colorscheme").colorschemes[theme]

		M.loaded = true
	end
end

return M
