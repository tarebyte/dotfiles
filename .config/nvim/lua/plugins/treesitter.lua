return {
  {
    "nvim-treesitter/nvim-treesitter",
    dependencies = {
      {
        "RRethy/nvim-treesitter-endwise",
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
