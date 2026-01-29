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
  {
    "tarebyte/treesitter-rails",
    dependencies = { "nvim-treesitter/nvim-treesitter" },
    ft = "ruby",
    config = function()
      require("treesitter-rails").setup()
    end,
  },
}
