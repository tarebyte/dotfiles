local M = {}

M.loaded = false

-- https://github.com/tarebyte/nvim-base16/blob/5f34bccc232b687309b32b53bdf1aab73beeec2b/lua/colors/ocean.lua
local ok, _ = pcall(require, "base16-colorscheme")
if ok then
	if vim.g.colors_name ~= nil then
		local theme = (vim.g.colors_name):gsub("base16%p", "")
		M = require("base16-colorscheme").colorschemes[theme]

		M.loaded = true
	end
end

-- https://github.com/RRethy/nvim-base16/blob/d8c6c19d87b2d8489bb4bbc532c5036c843e2fd9/lua/base16-colorscheme.lua#L54-L80
M.highlight = setmetatable({}, {
	__newindex = function(_, hlgroup, args)
		if "string" == type(args) then
			vim.cmd(("hi! link %s %s"):format(hlgroup, args))
			return
		end

		local guifg, guibg, gui, guisp = args.guifg or nil, args.guibg or nil, args.gui or nil, args.guisp or nil
		local cmd = { "hi", hlgroup }
		if guifg then
			table.insert(cmd, "guifg=" .. guifg)
		end
		if guibg then
			table.insert(cmd, "guibg=" .. guibg)
		end
		if gui then
			table.insert(cmd, "gui=" .. gui)
		end
		if guisp then
			table.insert(cmd, "guisp=" .. guisp)
		end
		vim.cmd(table.concat(cmd, " "))
	end,
})

return M
