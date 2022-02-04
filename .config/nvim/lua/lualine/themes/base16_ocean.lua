local colors = require("user.utils.colors")

return {
	normal = {
		a = { fg = colors.base01, bg = colors.base0B, gui = "bold" },
		b = { fg = colors.base06, bg = colors.base02 },
		c = { fg = colors.base09, bg = colors.base01 },
	},
	insert = {
		a = { fg = colors.base01, bg = colors.base0D, gui = "bold" },
		b = { fg = colors.base06, bg = colors.base02 },
		c = { fg = colors.base09, bg = colors.base01 },
	},
	replace = {
		a = { fg = colors.base01, bg = colors.base08, gui = "bold" },
		b = { fg = colors.base06, bg = colors.base02 },
		c = { fg = colors.base09, bg = colors.base01 },
	},
	visual = {
		a = { fg = colors.base01, bg = colors.base0E, gui = "bold" },
		b = { fg = colors.base06, bg = colors.base02 },
		c = { fg = colors.base09, bg = colors.base01 },
	},
	command = {
		a = { fg = colors.base01, bg = colors.base0C, gui = "bold" },
		b = { fg = colors.base06, bg = colors.base02 },
		c = { fg = colors.base09, bg = colors.base01 },
	},
	inactive = {
		a = { fg = colors.base05, bg = colors.base01, gui = "bold" },
		b = { fg = colors.base05, bg = colors.base01 },
		c = { fg = colors.base05, bg = colors.base01 },
	},
}
