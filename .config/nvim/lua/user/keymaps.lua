local keymap = vim.api.nvim_set_keymap

-- The one true leader key
vim.g.mapleader = [[,]]
vim.g.maplocalleader = [[,]]

-- easy wrap toggling
keymap("n", "<LEADER>w", ":set wrap!<CR>", {})
keymap("n", "<LEADER>W", ":set nowrap<CR>", {})

-- shortcut to save all
keymap("n", "<Leader>ss", ":wa<cr>", {})

-- close all other windows (in the current tab)
keymap("n", "gW", ":only<cr>", {})

-- go to the alternate file (previous buffer) with g-enter
keymap("n", "g", "", {})

-- Search command shortcut
keymap("n", "<Leader>s", ":Search<Space>", {})

-- insert blank lines without going into insert mode
keymap("n", "go", "o<esc>", {})
keymap("n", "gO", "O<esc>", {})

-- Yank from the cursor to the end of the line, to be consistent with C and D.
keymap("n", "Y", "y$", { noremap = true })

-- clean up trailing whitespace
keymap("", "<Leader>c", ":StripWhitespace<cr>", {})

-- delete all buffers
keymap("", "<Leader>d", ":bufdo bd<cr>", {})

-- map spacebar to clear search highlight
keymap("n", "<LEADER><SPACE>", ":noh<CR>", { noremap = true })

-- fast access to the :
keymap("n", "<Space>", ":", { noremap = true })
