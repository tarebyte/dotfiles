local status_ok, lualine = pcall(require, "lualine")
if not status_ok then
	return
end

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

vim.cmd([[
	highlight LualineWarning guifg=#EBCB8B guibg=#4F5B66
]])

lualine.setup({
	extensions = { "fugitive", "fzf" },
	options = {
		component_separators = { "", "" },
		icons_enabled = true,
		section_separators = { "", "" },
		theme = "base16_ocean",
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
			{ "branch", "b:gitsigns_head", icon = "" },
			{ "diff", source = diff_source(), symbols = { added = " ", modified = " ", removed = " " } },
			{
				"diagnostics",
				sources = { "ale" },
				diagnostics_color = {
					warn = "LualineWarning",
				},
				symbols = { error = " ", warn = " ", info = " ", hint = " " },
			},
		},
		lualine_c = {
			{ "filename", path = 1 },
		},
		lualine_x = {
			"encoding",
			"fileformat",
			{ "filetype", colored = false },
		},
	},
	inactive_sections = {
		lualine_c = {
			{ "filename", path = 1 },
		},
	},
})
