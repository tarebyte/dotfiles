local status_ok, lualine = pcall(require, "lualine")
if not status_ok then
	return
end

local colors = require("user.utils.colors")

-- https://github.com/LunarVim/LunarVim/blob/41b3f63c37ce2f79defc22a2cbcd347281a808a5/lua/lvim/core/lualine/components.lua#L4-L13
local function diff_source()
	local gitsigns = vim.b.gitsigns_status_dict
	if gitsigns then
		return {
			added = gitsigns.added,
			modified = gitsigns.changed,
			removed = gitsigns.removed,
		}
	end
end

vim.cmd([[highlight LualineWarning guifg=]] .. colors.base0A .. [[ guibg=]] .. colors.base02)

lualine.setup({
	options = {
		icons_enabled = true,
		theme = "base16_ocean",
		component_separators = { left = "", right = "" },
		section_separators = { left = "", right = "" },
	},
	sections = {
		lualine_a = {
			{
				"mode",
				fmt = function(str)
					return str:sub(1, 1)
				end,
				padding = 1,
			},
		},
		lualine_b = {
			{ "branch", "b:gitsigns_head", icon = "" },
			{
				"diff",
				colored = true,
				source = diff_source(),
				symbols = { added = " ", modified = " ", removed = " " },
			},
			{
				"diagnostics",
				sources = { "ale" },
				diagnostics_color = {
					warn = "LualineWarning",
				},
				symbols = { error = " ", warn = " ", info = "כֿ ", hint = " " },
			},
		},
		lualine_c = {
			{ "filename", symbols = { readonly = "" }, path = 1 },
		},
		lualine_x = {
			"encoding",
			{ "filetype", colored = false },
		},
	},
	inactive_sections = {
		lualine_c = {
			{ "filename", path = 1 },
		},
	},
	extensions = { "fzf" },
})
