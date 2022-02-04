local colors = {
	color00 = "#2b303b", -- Background
	color01 = "#343d46", -- Almost background
	color02 = "#4f5b66", -- Darkest gray
	color03 = "#65737e", -- Bright black
	color04 = "#a7adba", -- Light gray
	color05 = "#c0c5ce", -- White
	color06 = "#dfe1e8", -- Darker white
	color07 = "#eff1f5", -- Bright White
	color08 = "#bf616a", -- Red
	color09 = "#d08770", -- Bright orange
	color0A = "#ebcb8b", -- Yellow
	color0B = "#a3be8c", -- Green
	color0C = "#96b5b4", -- Cyan
	color0D = "#8fa1b3", -- Blue
	color0E = "#b48ead", -- Magenta
	color0F = "#ab7967", -- Darker Orange
}

return {
	normal = {
		a = { fg = colors.color01, bg = colors.color0B, gui = "bold" },
		b = { fg = colors.color06, bg = colors.color02 },
		c = { fg = colors.color09, bg = colors.color01 },
	},
	insert = {
		a = { fg = colors.color01, bg = colors.color0D, gui = "bold" },
		b = { fg = colors.color06, bg = colors.color02 },
		c = { fg = colors.color09, bg = colors.color01 },
	},
	replace = {
		a = { fg = colors.color01, bg = colors.color08, gui = "bold" },
		b = { fg = colors.color06, bg = colors.color02 },
		c = { fg = colors.color09, bg = colors.color01 },
	},
	visual = {
		a = { fg = colors.color01, bg = colors.color0E, gui = "bold" },
		b = { fg = colors.color06, bg = colors.color02 },
		c = { fg = colors.color09, bg = colors.color01 },
	},
	command = {
		a = { fg = colors.color01, bg = colors.color0C, gui = "bold" },
		b = { fg = colors.color06, bg = colors.color02 },
		c = { fg = colors.color09, bg = colors.color01 },
	},
	inactive = {
		a = { fg = colors.color05, bg = colors.color01, gui = "bold" },
		b = { fg = colors.color05, bg = colors.color01 },
		c = { fg = colors.color05, bg = colors.color01 },
	},
}
