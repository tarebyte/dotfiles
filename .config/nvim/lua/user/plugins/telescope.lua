local ok, telescope = pcall(require, "telescope")
if not ok then
	return
end

local actions = require("telescope.actions")
local builtin = require("telescope.builtin")

telescope.setup({
	defaults = {
		mappings = {
			i = {
				["<esc>"] = actions.close,
			},
		},
	},
})

telescope.load_extension("ctags_plus")
telescope.load_extension("fzf")

vim.keymap.set("n", "<C-p>", builtin.find_files, { silent = true })
vim.keymap.set("n", "<Leader>t", builtin.find_files, { silent = true })
vim.keymap.set("n", "<Leader>b", builtin.buffers, { silent = true })
vim.keymap.set("n", "<C-]>", ":lua require('telescope').extensions.ctags_plus.jump_to_tag()<cr>")
