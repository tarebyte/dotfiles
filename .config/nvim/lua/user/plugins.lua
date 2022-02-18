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
		use("tpope/vim-fugitive")
		use("tpope/vim-projectionist")
		use("tpope/vim-rails")
		use("tpope/vim-rake")
		use("tpope/vim-repeat")
		use("tpope/vim-surround")
		use("windwp/nvim-autopairs")
		use("vim-ruby/vim-ruby")

		-- CMP
		use({
			"hrsh7th/nvim-cmp",
			requires = {
				"hrsh7th/cmp-buffer",
				"hrsh7th/cmp-path",
				"hrsh7th/cmp-cmdline",
				{ "quangnguyen30192/cmp-nvim-tags", ft = { "ruby" } },
				{ "petertriho/cmp-git", requires = "nvim-lua/plenary.nvim" },
			},
		})

		-- Linting and formatting
		use("jose-elias-alvarez/null-ls.nvim")
		use("ntpeters/vim-better-whitespace")

		-- Commenting
		use({
			"numToStr/Comment.nvim",
			config = function()
				require("Comment").setup()
			end,
		})

		-- Files
		use("danro/rename.vim")
		use({
			"kristijanhusak/vim-dirvish-git",
			requires = "justinmk/vim-dirvish",
		})

		-- FZF
		use({
			"junegunn/fzf",
			requires = "junegunn/fzf.vim",
			run = function()
				vim.fn["fzf#install"]()
			end,
		})

		-- Tree Sitter
		use({ "nvim-treesitter/nvim-treesitter", run = ":TSUpdate" })
		use("nvim-treesitter/nvim-treesitter-textobjects")
		use("nvim-treesitter/playground")
		use("RRethy/nvim-treesitter-endwise")

		-- Theme
		use("nvim-lualine/lualine.nvim")
		use({
			"lewis6991/gitsigns.nvim",
			requires = "nvim-lua/plenary.nvim",
			tag = "release",
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
