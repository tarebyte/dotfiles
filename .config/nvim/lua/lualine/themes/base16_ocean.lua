local ok, base16 = pcall(require, "base16-colorscheme")
if not ok then
	return {}
end

return {
	normal = {
		a = { fg = base16.colors.base01, bg = base16.colors.base0B, gui = "bold" },
		b = { fg = base16.colors.base06, bg = base16.colors.base02 },
		c = { fg = base16.colors.base09, bg = base16.colors.base01 },
	},
	insert = {
		a = { fg = base16.colors.base01, bg = base16.colors.base0D, gui = "bold" },
		b = { fg = base16.colors.base06, bg = base16.colors.base02 },
		c = { fg = base16.colors.base09, bg = base16.colors.base01 },
	},
	replace = {
		a = { fg = base16.colors.base01, bg = base16.colors.base08, gui = "bold" },
		b = { fg = base16.colors.base06, bg = base16.colors.base02 },
		c = { fg = base16.colors.base09, bg = base16.colors.base01 },
	},
	visual = {
		a = { fg = base16.colors.base01, bg = base16.colors.base0E, gui = "bold" },
		b = { fg = base16.colors.base06, bg = base16.colors.base02 },
		c = { fg = base16.colors.base09, bg = base16.colors.base01 },
	},
	command = {
		a = { fg = base16.colors.base01, bg = base16.colors.base0C, gui = "bold" },
		b = { fg = base16.colors.base06, bg = base16.colors.base02 },
		c = { fg = base16.colors.base09, bg = base16.colors.base01 },
	},
	inactive = {
		a = { fg = base16.colors.base05, bg = base16.colors.base01, gui = "bold" },
		b = { fg = base16.colors.base05, bg = base16.colors.base01 },
		c = { fg = base16.colors.base05, bg = base16.colors.base01 },
	},
}
