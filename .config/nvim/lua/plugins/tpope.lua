----------------------
-- All hail @tpope --
----------------------

return {
	{
		"tpope/vim-rails",
		dependencies = {
			"tpope/vim-projectionist",
		},
	},
	{
		"tpope/vim-surround",
		event = { "BufReadPost", "BufNewFile" },
		dependencies = {
			"tpope/vim-repeat",
		},
	},
}
