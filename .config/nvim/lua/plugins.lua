local execute = vim.api.nvim_command
local fn = vim.fn

-- fn.stdpath('data') => ~/.local/share/nvim
local install_path = fn.stdpath('data')..'/site/pack/packer/start/packer.nvim'

-- Ensure that packer is available before trying to use packages.
if fn.empty(fn.glob(install_path)) > 0 then
	fn.system({'git', 'clone', 'https://github.com/wbthomason/packer.nvim', install_path})
	execute 'packadd packer.nvim'
end

return require('packer').startup({function()
	-- Packer can manage itself
	use 'wbthomason/packer.nvim'

	use 'danro/rename.vim'
	use 'tomtom/tcomment_vim'
	use 'tpope/vim-bundler'
	use 'tpope/vim-fugitive'
	use 'tpope/vim-projectionist'
	use 'tpope/vim-rails'
	use 'tpope/vim-rake'
	use 'tpope/vim-repeat'
	use 'tpope/vim-surround'

	use { 'dense-analysis/ale', config = [[require('config.ale')]] }
	use { 'junegunn/vim-easy-align', config = [[require('config.vim-easy-align')]] }
	use { 'kristijanhusak/vim-dirvish-git', config = [[require('config.vim-dirvish-git')]], requires = 'justinmk/vim-dirvish' }
	use { 'ludovicchabant/vim-gutentags', config = [[require('config.vim-gutentags')]] }
	use { 'neovim/nvim-lspconfig', config = [[require('config.nvim-lspconfig')]] }
	use { 'nvim-lualine/lualine.nvim', config = [[require('config.lualine')]] }
	use { 'nvim-treesitter/nvim-treesitter', config = [[require('config.nvim-treesitter')]], run = ':TSUpdate' }
	use { 'nvim-treesitter/nvim-treesitter-textobjects', config = [[require('config.nvim-treesitter-textobjects')]] }
	use { 'nvim-treesitter/playground', config = [[require('config.playground')]] }
	use { 'ntpeters/vim-better-whitespace', config = [[require('config.vim-better-whitespace')]] }
	use { 'tarebyte/nvim-base16', branch = 'tarebyte/color-updates' }

	use {
		'hrsh7th/nvim-cmp',
		config = [[require('config.nvim-cmp')]],
		requires = {
			'hrsh7th/cmp-buffer',
			'hrsh7th/cmp-cmdline',
			'hrsh7th/cmp-nvim-lsp',
			'hrsh7th/cmp-path',
			'hrsh7th/cmp-cmdline',
			'L3MON4D3/LuaSnip',
			'saadparwaiz1/cmp_luasnip'
		}
	}

	use {
		'junegunn/fzf',
		config = [[require('config.fzf')]],
		requires = 'junegunn/fzf.vim',
		run = function()
			vim.fn['fzf#install']()
		end
	}

	use {
		'lewis6991/gitsigns.nvim',
		requires = 'nvim-lua/plenary.nvim',
		config = function()
			require('gitsigns').setup()
		end
	}
end, config = { display = { open_fn = require('packer.util').float }}})
