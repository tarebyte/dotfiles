-- Lua conversion of restore-cursor last-position-jump
--
-- autocmd BufRead * autocmd FileType <buffer> ++once
--   \ if &ft !~# 'commit\|rebase' && line("'\"") > 1 && line("'\"") <= line("$") | exe 'normal! g`"' | endif
--
-- https://www.reddit.com/r/neovim/comments/ucgxmj/comment/i6coai3/?utm_source=share&utm_medium=web2x&context=3

vim.api.nvim_create_autocmd({ "BufReadPost" }, {
	pattern = { "*" },
	callback = function()
		local ft = vim.opt_local.filetype:get()

		-- don't apply to git messages
		if ft:match("commit") or ft:match("rebase") then
			return
		end

		-- get position of last saved edit
		local mark_position = vim.api.nvim_buf_get_mark(0, '"')

		local row = mark_position[1]
		local col = mark_position[2]

		if (row > 1) and (row <= vim.api.nvim_buf_line_count(0)) then
			vim.api.nvim_win_set_cursor(0, { row, col })
		end
	end,
	desc = "Restores the cursor to the last position.",
})
