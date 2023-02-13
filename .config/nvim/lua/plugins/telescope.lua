return {
	{
		"nvim-telescope/telescope.nvim",
		version = "0.1.1",
		cmd = "Telescope",
		dependencies = {
			"nvim-lua/plenary.nvim",
			"gnfisher/nvim-telescope-ctags-plus",
			{
				"nvim-telescope/telescope-fzf-native.nvim",
				build = "make",
			},
		},
		config = function()
			local telescope = require("telescope")

			telescope.setup({
				defaults = {
					mappings = {
						i = {
							["<esc>"] = require("telescope.actions").close,
						},
					},
				},
			})

			telescope.load_extension("ctags_plus")
			telescope.load_extension("fzf")
		end,
		keys = {
			{ "<C-p>", "<cmd>Telescope find_files<cr>", desc = "Ctrl-P replacement" },
			{ "<Leader>t", "<cmd>Telescope find_files<cr>", desc = "Find files" },
			{ "<Leader>b", "<cmd>Telescope buffers<cr>", desc = "Buffers" },
			{ "<C-]>", "<cmd>lua require('telescope').extensions.ctags_plus.jump_to_tag()<cr>", desc = "CTags" },
		},
	},
}
