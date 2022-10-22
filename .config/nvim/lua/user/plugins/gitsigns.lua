local status_ok, gitsigns = pcall(require, "gitsigns")
if not status_ok then
	return
end

gitsigns.setup({
	signs = {
		add = { text = "+" },
		change = { text = "~" },
	},
	numhl = true,
	current_line_blame = true,
	current_line_blame_opts = {
		delay = 400,
	},
})
