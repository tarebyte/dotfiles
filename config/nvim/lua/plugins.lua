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
	use 'danro/rename.vim'
	use {
		'dense-analysis/ale',
		config = function()
			vim.g['airline#extensions#ale#enabled'] = 1
			vim.g['ale_virtualtext_cursor'] = 1
			vim.g['ale_fix_on_save'] = 1

			vim.cmd('highlight ALEWarning gui=underline')
			vim.cmd('highlight ALEVirtualTextError guifg=#BF616A') -- red
			vim.cmd('highlight ALEVirtualTextWarning guifg=#EBCB8B') -- yellow
			vim.cmd('highlight ALEVirtualTextStyleWarning guifg=#EBCB8B') -- yellow
		end
	}

	use {
		'kristijanhusak/vim-dirvish-git',
		config = function()
			-- Show ignored files
			vim.g['dirvish_git_show_ignored'] = 1
		end,
		requires = { 'justinmk/vim-dirvish' }
	}

	use {
		'hoob3rt/lualine.nvim',
		config = function()
			-- https://github.com/vim-airline/vim-airline-themes/blob/531bcc9e5a4cb1b1fb4dec8face230bf3d205ac7/autoload/airline/themes/base16_ocean.vim
			local colors = {
				color00 = "#2b303b",
				color01 = "#343d46",
				color02 = "#4f5b66",
				color03 = "#65737e",
				color04 = "#a7adba",
				color05 = "#c0c5ce",
				color06 = "#dfe1e8",
				color07 = "#eff1f5",
				color08 = "#bf616a",
				color09 = "#d08770",
				color0A = "#ebcb8b",
				color0B = "#a3be8c",
				color0C = "#96b5b4",
				color0D = "#8fa1b3",
				color0E = "#b48ead",
				color0F = "#ab7967",
			}

			local base16_ocean = {
				normal = {
					a = {fg = colors.color01, bg = colors.color0B, gui = 'bold'},
					b = {fg = colors.color06, bg = colors.color02},
					c = {fg = colors.color09, bg = colors.color01}
				},
				insert = {
					a = {fg = colors.color01, bg = colors.color0D, gui = 'bold'},
					b = {fg = colors.color06, bg = colors.color02},
					c = {fg = colors.color09, bg = colors.color01}
				},
				replace = {
					a = {fg = colors.color01, bg = colors.color08, gui = 'bold'},
					b = {fg = colors.color06, bg = colors.color02},
					c = {fg = colors.color09, bg = colors.color01}
				},
				visual = {
					a = {fg = colors.color01, bg = colors.color0E, gui = 'bold'},
					b = {fg = colors.color06, bg = colors.color02},
					c = {fg = colors.color09, bg = colors.color01}
				},
				inactive = {
					a = {fg = colors.color05, bg = colors.color01, gui = 'bold'},
					b = {fg = colors.color05, bg = colors.color01},
					c = {fg = colors.color05, bg = colors.color01}
				},
			}

			require('lualine').setup {
				extensions = { 'fugitive', 'fzf' },
				options = {
					component_separators = {'', ''},
					section_separators = {'', ''},
					icons_enabled = false,
					theme = base16_ocean
				},
				sections = {
					lualine_c = {
						{
							'filename',
							path = 1
						}
					}
				},
				inactive_sections = {
					lualine_c = {
						{
							'filename',
							path = 1
						}
					}
				}
			}
		end
	}

	use {
		'hrsh7th/nvim-compe',
		config = function()
			-- https://github.com/hrsh7th/nvim-compe#prerequisite
			vim.o.completeopt = "menuone,noselect"

			-- https://github.com/hrsh7th/nvim-compe#lua-config
			require('compe').setup {
				enabled = true;
				autocomplete = true;
				debug = false;
				min_length = 1;
				preselect = 'enable';
				throttle_time = 80;
				source_timeout = 200;
				incomplete_delay = 400;
				max_abbr_width = 100;
				max_kind_width = 100;
				max_menu_width = 100;
				documentation = true;

				source = {
					path = true;
					buffer = true;
					-- tags = true; -- too noisy I think
					nvim_lsp = true;
				};
			}

			local map = vim.api.nvim_set_keymap
			local opts = { noremap = true, silent = true, expr = true }

			-- https://github.com/hrsh7th/nvim-compe#mappings
			map('i', '<C-Space>', 'compe#complete()', opts)
			map('i', '<CR>', "compe#confirm('<CR>')", opts)
			map('i', '<C-e>', "compe#confirm('<C-e>')", opts)
			map('i', '<C-d>', "compe#scroll({ 'delta': +4 })", opts)
			map('i', '<C-d>', "compe#scroll({ 'delta': -4 })", opts)
		end
	}

	use {
		'junegunn/fzf',
		config = function()
			local map = vim.api.nvim_set_keymap

			map('n', '<C-p>', ':FZF<cr>', { noremap = true })
			map('n', '<Leader>t', ':FZF<cr>', {})
			map('n', '<Leader>b', ':Buffers<cr>', {})
			map('n', '<c-]>', ':Tags <c-r><c-w><cr>', { noremap = true })
		end,
		run = function()
			vim.fn['fzf#install']()
		end,
		requires = { 'junegunn/fzf.vim' },
	}

	use { 'junegunn/vim-easy-align',
		config = function()
			local map = vim.api.nvim_set_keymap

			map('x', 'ga', '<Plug>(EasyAlign)', {})
			map('n', 'ga', '<Plug>(EasyAlign)', {})
		end
	}

	use {
		'lewis6991/gitsigns.nvim', requires = { 'nvim-lua/plenary.nvim' },
		config = function() require('gitsigns').setup() end
	}

	use {
		'ludovicchabant/vim-gutentags',
		config = function()
			vim.g['gutentags_file_list_command'] = "rg --files"
		end,
	}


	use {
		'ntpeters/vim-better-whitespace',
		config = function()
			vim.cmd('highlight ExtraWhitespace ctermbg=red ctermfg=white guibg=#BF616A guifg=#C0C5CE')
		end,
	}

	use {
		'neovim/nvim-lspconfig',
		config = function()
			local nvim_lsp = require('lspconfig')

-- Use an on_attach function to only map the following keys
			-- after the language server attaches to the current buffer
			local on_attach = function(client, bufnr)
				local function buf_set_keymap(...) vim.api.nvim_buf_set_keymap(bufnr, ...) end
				local function buf_set_option(...) vim.api.nvim_buf_set_option(bufnr, ...) end

				--Enable completion triggered by <c-x><c-o>
				buf_set_option('omnifunc', 'v:lua.vim.lsp.omnifunc')

				-- Mappings.
				local opts = { noremap=true, silent=true }

				-- See `:help vim.lsp.*` for documentation on any of the below functions
				buf_set_keymap('n', 'gD', '<Cmd>lua vim.lsp.buf.declaration()<CR>', opts)
				buf_set_keymap('n', 'gd', '<Cmd>lua vim.lsp.buf.definition()<CR>', opts)
				buf_set_keymap('n', 'K', '<Cmd>lua vim.lsp.buf.hover()<CR>', opts)
				buf_set_keymap('n', 'gi', '<cmd>lua vim.lsp.buf.implementation()<CR>', opts)
				buf_set_keymap('n', '<C-k>', '<cmd>lua vim.lsp.buf.signature_help()<CR>', opts)
				buf_set_keymap('n', '<space>wa', '<cmd>lua vim.lsp.buf.add_workspace_folder()<CR>', opts)
				buf_set_keymap('n', '<space>wr', '<cmd>lua vim.lsp.buf.remove_workspace_folder()<CR>', opts)
				buf_set_keymap('n', '<space>wl', '<cmd>lua print(vim.inspect(vim.lsp.buf.list_workspace_folders()))<CR>', opts)
				buf_set_keymap('n', '<space>D', '<cmd>lua vim.lsp.buf.type_definition()<CR>', opts)
				buf_set_keymap('n', '<space>rn', '<cmd>lua vim.lsp.buf.rename()<CR>', opts)
				buf_set_keymap('n', '<space>ca', '<cmd>lua vim.lsp.buf.code_action()<CR>', opts)
				buf_set_keymap('n', 'gr', '<cmd>lua vim.lsp.buf.references()<CR>', opts)
				buf_set_keymap('n', '<space>e', '<cmd>lua vim.lsp.diagnostic.show_line_diagnostics()<CR>', opts)
				buf_set_keymap('n', '[d', '<cmd>lua vim.lsp.diagnostic.goto_prev()<CR>', opts)
				buf_set_keymap('n', ']d', '<cmd>lua vim.lsp.diagnostic.goto_next()<CR>', opts)
				buf_set_keymap('n', '<space>q', '<cmd>lua vim.lsp.diagnostic.set_loclist()<CR>', opts)
				buf_set_keymap("n", "<space>f", "<cmd>lua vim.lsp.buf.formatting()<CR>", opts)
			end

-- Use a loop to conveniently call 'setup' on multiple servers and
			-- map buffer local keybindings when the language server attaches
			local servers = { "rust_analyzer", "tsserver" }
			for _, lsp in ipairs(servers) do
				nvim_lsp[lsp].setup { on_attach = on_attach }
			end
		end
	}

	use {
		'nvim-treesitter/nvim-treesitter',
		config = function()
			require('nvim-treesitter.configs').setup {
				ensure_installed = "maintained",
				highlight = {
					enable = true,
				},
				indent = {
					enable = true
				}
			}
		end,
		run = ':TSUpdate'
	}

	use { 'nvim-treesitter/nvim-treesitter-textobjects',
		config = function()
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
		end
	}

	use {
		'nvim-treesitter/playground',
		config = function()
			require "nvim-treesitter.configs".setup {
				query_linter = {
					enable = true,
					use_virtual_text = true,
					lint_events = {"BufWrite", "CursorHold"},
				},
			}
		end
	}

	use { 'tarebyte/nvim-base16', branch = 'tarebyte/color-updates' }

	use 'tomtom/tcomment_vim'

	-- All hail @tpope
	use {
		'tpope/vim-bundler',
		'tpope/vim-fugitive',
		{ 'tpope/vim-rails' },
		{
			'tpope/vim-rake',
			requires = {
				'tpope/vim-projectionist'
			}
		},
		{ 'tpope/vim-repeat' },
		{ 'tpope/vim-surround' }
	}

	-- Packer can manage itself
	use 'wbthomason/packer.nvim'

	-- My Silly attempt to get endwise back
	use {
		'windwp/nvim-autopairs',
		config = function()
			local npairs = require('nvim-autopairs')
			npairs.setup({ check_ts = true })

			-- clear all rule if you don't want to use autopairs
			npairs.clear_rules()

			-- https://github.com/windwp/nvim-autopairs/blob/master/doc/endwise.md
			-- local endwise = require('nvim-autopairs.ts-rule').endwise
			-- npairs.add_rules({})
		end
	}

end, config = { display = { open_fn = require('packer.util').float }}})
