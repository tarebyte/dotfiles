-- LazyVim provides the bulk of keymaps. Only additions/overrides live here.
-- which-key picks up the `desc` field automatically.

local map = vim.keymap.set

map("n", "<C-p>", function()
  Snacks.picker.files()
end, { desc = "Find files" })
map("n", "<leader>t", function()
  Snacks.picker.files()
end, { desc = "Find files" })
map("n", "<leader>cw", "<cmd>StripWhitespace<cr>", { desc = "Strip trailing whitespace" })
map("n", "<leader>O", "<cmd>Trouble symbols toggle focus=false<cr>", { desc = "Show outline (Trouble symbols)" })

map("n", "<leader>fa", "<cmd>A<cr>", { desc = "Alternate file (projectionist)" })

-- Hover under the mouse. Replaces require("hover").mouse(), which asks LSP about the
-- character to the right of the mouse (it passes getmousepos()'s 1-based column as 0-based)
-- and opens a "No result" float over blank space.
local hover_timer = assert(vim.uv.new_timer())
map("n", "<MouseMove>", function()
  hover_timer:start(
    500,
    0,
    vim.schedule_wrap(function()
      local pos = vim.fn.getmousepos()
      if pos.winid == 0 or pos.line == 0 then
        return
      end
      local buf = vim.api.nvim_win_get_buf(pos.winid)
      local line = vim.api.nvim_buf_get_lines(buf, pos.line - 1, pos.line, false)[1] or ""
      if not line:sub(pos.column, pos.column):match("%S") then
        return
      end
      require("hover").close(buf)
      require("hover").open({ bufnr = buf, pos = { pos.line, pos.column - 1 }, relative = "mouse" })
    end)
  )
end, { desc = "Hover under mouse" })
