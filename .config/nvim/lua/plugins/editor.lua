return {
	{
		"windwp/nvim-autopairs",
		event = { "BufReadPost", "BufNewFile" },
		config = true,
	},
	{
		"numToStr/Comment.nvim",
		event = { "BufReadPost", "BufNewFile" },
		config = true,
	},
	{
		"miyakogi/conoline.vim",
		event = { "BufReadPost", "BufNewFile" },
		config = function()
			vim.cmd([[ConoLineEnable]])
		end,
	},
	{
		"lewis6991/gitsigns.nvim",
		event = { "BufReadPre", "BufNewFile" },
		opts = {
			signs = {
				add = { text = "+" },
				change = { text = "~" },
			},
			numhl = true,
			current_line_blame = true,
			current_line_blame_opts = {
				delay = 400,
			},
		},
	},
	{
		"lukas-reineke/indent-blankline.nvim",
		event = { "BufReadPost", "BufNewFile" },
		opts = {
			filetype_exclude = { "dirvish", "help", "lazy" },
			show_current_context_start = true,
			use_treesitter = true,
		},
	},
	{
		"anuvyklack/pretty-fold.nvim",
		event = { "BufReadPost", "BufNewFile" },
		dependencies = {
			{
				"anuvyklack/fold-preview.nvim",
				dependencies = {
					"anuvyklack/keymap-amend.nvim",
				},
				opts = {
					border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
				},
			},
		},
		opts = {
			keep_indentation = false,
			fill_char = " ",
			sections = {
				left = {
					">",
					function()
						return string.rep(" ", vim.v.foldlevel)
					end,
					"content",
					"",
				},
			},
		},
	},
	{
		"shortcuts/no-neck-pain.nvim",
		event = { "BufReadPost", "BufNewFile" },
		version = "*",
		opts = {
			width = 120,
		},
	},
	{
		"ntpeters/vim-better-whitespace",
		event = { "BufReadPost", "BufNewFile" },
		config = function()
			vim.g.better_whitespace_filetypes_blacklist = {
				"lazy",
				"diff",
				"git",
				"gitcommit",
				"unite",
				"qf",
				"help",
				"markdown",
				"fugitive",
			}
		end,
		keys = {
			{ "<Leader>c", "<cmd>StripWhitespace<cr>", "", desc = { "Clean up trailing whitespace" } },
		},
	},
}
