local map = vim.api.nvim_set_keymap

map("n", "<C-p>", ":Files<cr>", { noremap = true })
map("n", "<Leader>t", ":Files<cr>", {})
map("n", "<Leader>b", ":Buffers<cr>", {})
map("n", "<c-]>", ":Tags <c-r><c-w><cr>", { noremap = true })
