local status_ok, lualine = pcall(require, "lualine")
if not status_ok then
	return
end

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
			{ "diff", symbols = { added = ' ', modified = ' ', removed = ' ' } },
		},
		lualine_c = {
			{ "filename", path = 1 },
		},
	},
	inactive_sections = {
		lualine_b = {
			{ "branch", icon = "" },
			{ "diff", symbols = { added = ' ', modified = ' ', removed = ' ' } },
		},
		lualine_c = {
			{ "filename", path = 1 },
		},
	},
})
