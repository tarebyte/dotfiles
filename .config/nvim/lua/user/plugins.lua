local fn = vim.fn

-- fn.stdpath("data") => ~/.local/share/nvim
local install_path = fn.stdpath("data") .. "/site/pack/packer/start/packer.nvim"

-- Ensure that packer is available before trying to use packages.
if fn.empty(fn.glob(install_path)) > 0 then
	PACKER_BOOTSTRAP = fn.system({
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
		use({ "shortcuts/no-neck-pain.nvim", tag = "*" })

		-- LSP
		use({
			"williamboman/mason.nvim",
			"williamboman/mason-lspconfig.nvim",
			"neovim/nvim-lspconfig",
			{ "weilbith/nvim-code-action-menu", cmd = "CodeActionMenu" },
			"kosayoda/nvim-lightbulb",
		})

		-- Snippets
		use("L3MON4D3/LuaSnip") --snippet engine
		use("rafamadriz/friendly-snippets")

		-- CMP
		use({
			"hrsh7th/nvim-cmp",
			requires = {
				"hrsh7th/cmp-buffer",
				"hrsh7th/cmp-cmdline",
				"hrsh7th/cmp-path",
				"hrsh7th/cmp-nvim-lsp",
				"hrsh7th/cmp-nvim-lua",
				"onsails/lspkind-nvim",
				{ "petertriho/cmp-git", requires = "nvim-lua/plenary.nvim" },
				"saadparwaiz1/cmp_luasnip",
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

		-- Folding
		use("anuvyklack/pretty-fold.nvim")
		use({ "anuvyklack/fold-preview.nvim", requires = "anuvyklack/keymap-amend.nvim" })

		-- Telescope
		use({ "nvim-telescope/telescope.nvim", tag = "0.1.0" })
		use({ "nvim-telescope/telescope-fzf-native.nvim", run = "make" })
		use("gnfisher/nvim-telescope-ctags-plus")

		-- Tree Sitter
		use({ "nvim-treesitter/nvim-treesitter", run = ":TSUpdate" })
		use("nvim-treesitter/nvim-treesitter-textobjects")
		use("nvim-treesitter/playground")
		use("nvim-treesitter/nvim-treesitter-context")
		use("RRethy/nvim-treesitter-endwise")

		use({
			"nvim-lualine/lualine.nvim",
			requires = { "kyazdani42/nvim-web-devicons", opt = true },
		})

		use({
			"lewis6991/gitsigns.nvim",
			requires = "nvim-lua/plenary.nvim",
			branch = "main",
		})

		-- Theme
		use("RRethy/nvim-base16")
		use("miyakogi/conoline.vim")
		use("lukas-reineke/indent-blankline.nvim")

		-- Testing
		use({ "vim-test/vim-test", requires = {
			"tpope/vim-dispatch",
			"radenling/vim-dispatch-neovim",
		} })

		if PACKER_BOOTSTRAP then
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
