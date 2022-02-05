local status_ok, nvim_treesitter = pcall(require, "nvim-treesitter.configs")
if not status_ok then
	return
end

nvim_treesitter.setup({
	ensure_installed = "maintained",
	endwise = {
		enable = true,
	},
	highlight = {
		enable = true,
	},
	indent = {
		enable = true,
	},
	playground = {
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
