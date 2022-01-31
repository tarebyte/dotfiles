local fn = vim.fn

-- fn.stdpath("data") => ~/.local/share/nvim
local install_path = fn.stdpath("data") .. "/site/pack/packer/start/packer.nvim"

-- Ensure that packer is available before trying to use packages.
if fn.empty(fn.glob(install_path)) > 0 then
	packer_bootstrap = fn.system({
		"git",
		"clone",
		"--depth",
		"1",
		"https://github.com/wbthomason/packer.nvim",
		install_path,
	})

	print("Installing packer close and reopen Neovim...")
	vim.cmd([[packadd packer.nvim]])
end

vim.cmd([[
  augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
  augroup end
]])

return require("packer").startup({
	function(use)
		use("wbthomason/packer.nvim")

		-- Misc
		use("kyazdani42/nvim-web-devicons")
		use("tomtom/tcomment_vim")
		use("tpope/vim-fugitive")
		use("tpope/vim-projectionist")
		use("tpope/vim-rails")
		use("tpope/vim-rake")
		use("tpope/vim-repeat")
		use("tpope/vim-surround")

		-- CTags
		use({ "ludovicchabant/vim-gutentags", config = [[require("user.plugins.vim-gutentags")]] })

		-- CMP
		use("hrsh7th/nvim-cmp")
		use("hrsh7th/cmp-buffer")
		use("hrsh7th/cmp-path")
		use("hrsh7th/cmp-cmdline")
		use("saadparwaiz1/cmp_luasnip")

		-- Snippets
		use("L3MON4D3/LuaSnip")
		use("rafamadriz/friendly-snippets")

		-- Linting and formatting
		use({ "dense-analysis/ale", config = [[require("user.plugins.ale")]] })
		use({ "ntpeters/vim-better-whitespace", config = [[require("user.plugins.vim-better-whitespace")]] })

		-- Files
		use("danro/rename.vim")
		use({
			"kristijanhusak/vim-dirvish-git",
			config = [[require("user.plugins.vim-dirvish-git")]],
			requires = "justinmk/vim-dirvish",
		})

		-- FZF
		use({
			"junegunn/fzf",
			config = [[require("user.plugins.fzf")]],
			requires = "junegunn/fzf.vim",
			run = function()
				vim.fn["fzf#install"]()
			end,
		})

		-- Tree Sitter
		use({ "nvim-treesitter/nvim-treesitter", run = ":TSUpdate" })
		use("nvim-treesitter/nvim-treesitter-textobjects")

		-- Theme
		use({ "nvim-lualine/lualine.nvim", config = [[require("user.plugins.lualine")]] })
		use({
			"lewis6991/gitsigns.nvim",
			requires = "nvim-lua/plenary.nvim",
			config = [[require("user.plugins.gitsigns")]],
		})
		use({ "tarebyte/nvim-base16", branch = "tarebyte/color-updates" })

		if packer_bootstrap then
			require("packer").sync()
		end
	end,
	config = {
		display = {
			open_fn = function()
				return require("packer.util").float({ border = "rounded" })
			end,
		},
	},
})
