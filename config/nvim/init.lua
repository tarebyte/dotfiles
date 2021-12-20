local map = vim.api.nvim_set_keymap

-- https://github.com/dense-analysis/ale#5iii-how-can-i-use-ale-and-cocnvim-together
vim.g['ale_disable_lsp'] = 1

--- PLUGINS ---
require('plugins')

--- COLORS ---
vim.o.termguicolors = true
vim.opt.background = 'dark'

-- This technically works even if we're not using the their vim plugin.
-- https://github.com/chriskempson/base16-shell/tree/ce8e1e540367ea83cc3e01eec7b2a11783b3f9e1#base16-vim-users
if vim.fn.filereadable(vim.fn.expand('~/.vimrc_background')) then
	vim.api.nvim_exec([[ source ~/.vimrc_background ]], true)
end

--- SETTINGS ---

-- make backspace work in insert mode
vim.opt.backspace = 'indent,eol,start'

-- use system clipboard
vim.opt.clipboard = 'unnamed'

-- set temporary directory (don't litter local dir with swp/tmp files)
vim.opt.directory = '/tmp/' -- TODO: Maybe set XDG_DATA_HOME on Mac.

-- when lines are cropped at the screen bottom, show as much as possible
vim.opt.display = 'lastline'

-- assume the /g flag on substitutions to replace all matches in a line
vim.opt.gdefault = true

-- don't abandon buffers when unloading
vim.opt.hidden = true

-- searching is case insensitive when all lowercase
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- highlight trailing whitespace
vim.opt.listchars = 'tab:> ,trail:-,extends:>,precedes:<,nbsp:+'
vim.opt.list = true

-- enable line numbers, and don't make them any wider than necessary
vim.opt.number = true
vim.opt.numberwidth = 2

-- scroll the winder when we get near the edge
vim.opt.scrolloff = 4
vim.opt.sidescrolloff = 10

-- flip the default split directions to the sane ones
vim.opt.splitright = true
vim.opt.splitbelow = true

-- use 2 spaces for tabs
vim.opt.expandtab = true
vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2

-- don't beep for errors
vim.opt.visualbell = true

-- use tab-complete to see a list of possiblities when entering commands
vim.opt.wildmode = 'list:longest,full'

-- don't wrap long lines
vim.opt.wrap = false

--- MAPPINGS ---

-- The one true leader key
vim.g.mapleader = [[,]]
vim.g.maplocalleader = [[,]]

-- easy wrap toggling
map('n', '<LEADER>w', ':set wrap!<CR>', {})
map('n', '<LEADER>W', ':set nowrap<CR>', {})

-- shortcut to save all
map('n', '<Leader>ss', ':wa<cr>', {})

-- close all other windows (in the current tab)
map('n', 'gW', ':only<cr>', {})

-- go to the alternate file (previous buffer) with g-enter
map('n', 'g', '', {})

-- Search command shortcut
map('n', '<Leader>s', ':Search<Space>', {})

-- insert blank lines without going into insert mode
map('n', 'go', 'o<esc>', {})
map('n', 'gO', 'O<esc>', {})

-- Yank from the cursor to the end of the line, to be consistent with C and D.
map('n', 'Y', 'y$', { noremap = true })

-- clean up trailing whitespace
map('', '<Leader>c', ':StripWhitespace<cr>', {})

-- delete all buffers
map('', '<Leader>d', ':bufdo bd<cr>', {})

-- map spacebar to clear search highlight
map('n', '<LEADER><SPACE>', ':noh<CR>', { noremap = true })

-- fast access to the :
map('n', '<Space>', ':', { noremap = true })

-- COMMANDS

-- remember the last position in file
vim.cmd('au BufReadPost * if line("\'\\"") > 1 && line("\'\\"") < line("$") | exe "normal! g\'\\"" | endif')

-- recompile packer on save of plugins.lua
vim.cmd([[autocmd BufWritePost plugins.lua source <afile> | PackerCompile]])

-- Create a search command that uses Ripgrep and offers previews
local search_command = "command! -bang -complete=file -nargs=* Search call fzf#vim#grep('rg --column --line-number --no-heading --color=always '.<q-args>, 1, <bang>0 ? fzf#vim#with_preview('up:60%') : fzf#vim#with_preview('right:50%:hidden', '?'), <bang>0)"
vim.cmd(search_command)
