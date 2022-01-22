require('nvim-treesitter.configs').setup {
	textobjects = {
		select = {
			enable = false,
			keymaps = {
				-- You can use the capture groups defined in textobjects.scm
				["ob"] = "@block.outer",
				["ib"] = "@block.inner",
			},
		},
	},
}
