return {
  {
    "nvim-treesitter/nvim-treesitter",
    commit = "19ac9e8b5c1e5eedd2ae7957243e25b32e269ea7", -- https://github.com/nvim-treesitter/nvim-treesitter-textobjects/issues/617
    dependencies = {
      {
        "RRethy/nvim-treesitter-endwise",
        "nvim-treesitter/playground",
      },
    },
    opts = function(_, opts)
      opts.endwise = { enable = true }
      opts.playground = { enable = true }

      vim.list_extend(opts.ensure_installed, {
        "comment",
        "css",
        "dockerfile",
        "elixir",
        "fish",
        "ruby",
        "scss",
        "scheme",
      })
    end,
  },
}
