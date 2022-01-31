local status_ok, nvim_treesitter = pcall(require, "nvim-treesitter.config")
if not status_ok then
	return
end

nvim_treesitter.setup({
	ensure_installed = "maintained",
	highlight = {
		enable = true,
	},
	indent = {
		enable = true,
	},
	textobjects = {
		select = {
			enable = false,
			keymaps = {
				-- You can use the capture groups defined in textobjects.scm
				["ob"] = "@block.outer",
				["ib"] = "@block.inner",
			},
		},
	},
})
