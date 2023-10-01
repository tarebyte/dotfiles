return {
  "vim-test/vim-test",
  event = { "BufReadPost", "BufNewFile" },
  dependencies = {
    "radenling/vim-dispatch-neovim",
    dependencies = {
      "tpope/vim-dispatch",
    },
  },
  config = function()
    vim.g["test#strategy"] = "dispatch"
  end,
  keys = {
    { "\\t", "<cmd>TestNearest<cr>", {} },
    { "\\T", "<cmd>TestFile<cr>", {} },
  },
}
