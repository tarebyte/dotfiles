-- LazyVim provides the bulk of keymaps. Only additions/overrides live here.
-- which-key picks up the `desc` field automatically.

local map = vim.keymap.set

map("n", "Y", "y$", { desc = "Yank to end of line" })
map("n", "<C-p>", function() Snacks.picker.files() end, { desc = "Find files" })
map("n", "<leader>t", function() Snacks.picker.files() end, { desc = "Find files" })
map("n", "go", "o<Esc>", { desc = "Insert blank line below" })
map("n", "gO", "O<Esc>", { desc = "Insert blank line above" })
map("n", "<leader>cs", "<cmd>StripWhitespace<cr>", { desc = "Strip trailing whitespace" })
map(
  "n",
  "<leader>O",
  "<cmd>Trouble symbols toggle focus=false<cr>",
  { desc = "Show outline (Trouble symbols)" }
)

map("n", "<leader>fa", "<cmd>A<cr>", { desc = "Alternate file (projectionist)" })
