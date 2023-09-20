return {
	"nvim-treesitter/nvim-treesitter",
	version = false,
	build = ":TSUpdate",
	event = { "BufReadPost", "BufNewFile" },
	dependencies = {
		"nvim-treesitter/nvim-treesitter-textobjects",
		"nvim-treesitter/playground",
		"nvim-treesitter/nvim-treesitter-context",
		"RRethy/nvim-treesitter-endwise",
	},
	opts = {
		ensure_installed = {
			"bash",
			"comment",
			"css",
			"dockerfile",
			"elixir",
			"fish",
			"html",
			"javascript",
			"json",
			"lua",
			"markdown",
			"markdown_inline",
			"query",
			"regex",
			"ruby",
			"scss",
			"scheme",
			"typescript",
			"vim",
			"yaml",
		},
		endwise = {
			enable = true,
		},
		highlight = {
			enable = true,
		},
		indent = {
			enable = true,
		},
		playground = {
			enable = true,
		},
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
	},
	config = function(_, opts)
		require("nvim-treesitter.configs").setup(opts)
	end,
}
