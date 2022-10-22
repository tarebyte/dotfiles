local status_ok, nvim_treesitter = pcall(require, "nvim-treesitter.configs")
if not status_ok then
	return
end

nvim_treesitter.setup({
	ensure_installed = {
		"bash",
		"comment",
		"css",
		"dockerfile",
		"elixir",
		"fish",
		"html",
		"javascript",
		"json",
		"lua",
		"query",
		"ruby",
		"scss",
		"scheme",
		"typescript",
		"vim",
	},
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

-- https://github.com/nvim-treesitter/nvim-treesitter#folding
vim.wo.foldmethod = "expr"
vim.wo.foldexpr = "nvim_treesitter#foldexpr()"
