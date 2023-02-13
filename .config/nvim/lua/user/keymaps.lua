-- The one true leader key
vim.g.mapleader = [[,]]
vim.g.maplocalleader = [[,]]

-- easy wrap toggling
vim.keymap.set("n", "<LEADER>w", ":set wrap!<CR>")
vim.keymap.set("n", "<LEADER>W", ":set nowrap<CR>")

-- shortcut to save all
vim.keymap.set("n", "<Leader>ss", ":wa<cr>")

-- close all other windows (in the current tab)
vim.keymap.set("n", "gW", ":only<cr>")

-- go to the alternate file (previous buffer) with g-enter
vim.keymap.set("n", "g", "")

-- insert blank lines without going into insert mode
vim.keymap.set("n", "go", "o<esc>")
vim.keymap.set("n", "gO", "O<esc>")

-- Yank from the cursor to the end of the line, to be consistent with C and D.
vim.keymap.set("n", "Y", "y$")

-- delete all buffers
vim.keymap.set("", "<Leader>d", ":bufdo bd<cr>")

-- map spacebar to clear search highlight
vim.keymap.set("n", "<LEADER><SPACE>", ":noh<CR>")

-- fast access to the :
vim.keymap.set("n", "<Space>", ":")
