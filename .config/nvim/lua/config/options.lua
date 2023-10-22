-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here

-- The one true leader key
vim.g.mapleader = [[,]]

-- assume the /g flag on substitutions to replace all matches in a line
vim.opt.gdefault = true

-- highlight trailing whitespace
vim.opt.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+"

-- don't use relative line numbers
vim.wo.relativenumber = false

-- No Popup blend
vim.opt.pumblend = 0
