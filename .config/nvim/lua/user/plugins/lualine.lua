local status_ok, lualine = pcall(require, "lualine")
if not status_ok then
	return
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
		lualine_b = {
			{ "branch", icon = "" },
			{ "diff", symbols = { added = " ", modified = " ", removed = " " } },
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
			{ "filetype", colored = false, icon_only = true },
		},
	},
	inactive_sections = {
		lualine_c = {
			{ "filename", path = 1 },
		},
	},
})
