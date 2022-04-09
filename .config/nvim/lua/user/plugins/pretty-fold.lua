vim.cmd([[hi Folded ctermbg=NONE guibg=NONE]])

local fold_ok, pretty_fold = pcall(require, "pretty-fold")
if not fold_ok then
	return
end

local preview_ok, pretty_fold_preview = pcall(require, "pretty-fold.preview")
if not preview_ok then
	return
end

pretty_fold.setup({
	keep_indentation = false,
	fill_char = " ",
	sections = {
		left = {
			">",
			function()
				return string.rep(" ", vim.v.foldlevel)
			end,
			"content",
			"",
		},
	},
})

pretty_fold_preview.setup({
	border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
})
