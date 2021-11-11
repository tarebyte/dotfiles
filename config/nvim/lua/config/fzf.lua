local map = vim.api.nvim_set_keymap

map('n', '<C-p>', ':FZF<cr>', { noremap = true })
map('n', '<Leader>t', ':FZF<cr>', {})
map('n', '<Leader>b', ':Buffers<cr>', {})
map('n', '<c-]>', ':Tags <c-r><c-w><cr>', { noremap = true })
