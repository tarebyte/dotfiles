return {
  {
    "windwp/nvim-autopairs",
    event = "InsertEnter",
    opts = {},
  },
  {
    "lewis6991/gitsigns.nvim",
    opts = {
      numhl = true,
      current_line_blame = true,
      current_line_blame_opts = {
        delay = 400,
      },
    },
  },
  {
    "ntpeters/vim-better-whitespace",
    event = { "BufReadPost", "BufNewFile" },
    config = function()
      vim.g.better_whitespace_filetypes_blacklist = {
        "lazy",
        "diff",
        "git",
        "gitcommit",
        "unite",
        "qf",
        "help",
        "markdown",
        "fugitive",
      }
    end,
    keys = {
      { "<Leader>c", "<cmd>StripWhitespace<cr>", "", desc = { "Clean up trailing whitespace" } },
    },
  },
}
