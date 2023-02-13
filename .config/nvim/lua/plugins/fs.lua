return {
	{
		"justinmk/vim-dirvish",
		dependencies = {
			"kristijanhusak/vim-dirvish-git",
		},
		config = function()
			-- Show ignored files
			vim.g.dirvish_git_show_ignored = 1
		end,
	},
	{
		"tpope/vim-eunuch",
		event = "VeryLazy",
	},
}
