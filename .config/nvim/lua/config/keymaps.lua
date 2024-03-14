-- Keymaps are automatically loaded on the VeryLazy event
-- Default keymaps that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/keymaps.lua
-- Add any additional keymaps here

-- alternate file
vim.keymap.set("n", "<leader>fa", "", { desc = "Alternate file" })

-- insert blank lines without going into insert mode
vim.keymap.set("n", "go", "o<esc>")
vim.keymap.set("n", "gO", "O<esc>")

-- Yank from the cursor to the end of the line, to be consistent with C and D.
vim.keymap.set("n", "Y", "y$")

-- map spacebar to clear search highlight
vim.keymap.set("n", "<leader><space>", ":noh<CR>")
