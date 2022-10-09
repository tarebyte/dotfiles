local ok, telescope = pcall(require, "telescope")
if not ok then
	return
end

local actions = require("telescope.actions")

telescope.setup({
	defaults = {
		mappings = {
			i = {
				["<esc>"] = actions.close,
			},
		},
	},
})

require("telescope").load_extension("fzf")
require("telescope").load_extension("ctags_plus")

vim.keymap.set("n", "<C-p>", ":Telescope find_files<cr>", { silent = true })
vim.keymap.set("n", "<Leader>t", ":Telescope find_files<cr>", { silent = true })
vim.keymap.set("n", "<Leader>b", ":Telescope buffers<cr>", { silent = true })
vim.keymap.set("n", "<C-]>", ":lua require('telescope').extensions.ctags_plus.jump_to_tag()<cr>")
