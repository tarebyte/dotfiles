-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

-- The one true leader key
vim.g.mapleader = [[,]]

-- assume the /g flag on substitutions to replace all matches in a line
vim.o.gdefault = true

-- highlight trailing whitespace
vim.o.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+"

-- don't use relative line numbers
vim.wo.relativenumber = false
vim.o.numberwidth = 2
