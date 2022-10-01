local status_ok, fzfLua = pcall(require, "fzf-lua")
if not status_ok then
	return
end

fzfLua.setup({
	winopts = {
		preview = {
			title_align = "center",
		},
	},
	buffers = {
		color_icons = false,
	},
	files = {
		color_icons = false,
	},
	fzf_opts = {
		["--layout"] = "default",
	},
	tags = {
		color_icons = false,
	},
})

local map = vim.api.nvim_set_keymap

map("n", "<C-p>", ":FzfLua files<cr>", { noremap = true, silent = true })
map("n", "<Leader>t", ":FzfLua files<cr>", { noremap = true, silent = true })
map("n", "<Leader>b", ":FzfLua buffers<cr>", { silent = true })
map("n", "<c-]>", ":FzfLua tags_grep_cword<cr>", { noremap = true, silent = true })

vim.cmd([[
  command! -bang -complete=file -nargs=* Search :lua require("fzf-lua").live_grep_native({ prompt = '❯ ', search = <q-args> })
]])
