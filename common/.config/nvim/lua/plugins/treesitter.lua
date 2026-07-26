return {
  {
    "nvim-treesitter/nvim-treesitter",
    opts = {
      ensure_installed = {
        "css",
        "c_sharp",
        "dockerfile",
        "embedded_template",
        "fish",
        "git_config",
        "git_rebase",
        "gitattributes",
        "gitcommit",
        "gitignore",
        "gotmpl",
        "python",
        "latex",
        "ruby",
        "scss",
        "sql",
      },
    },
  },

  {
    "RRethy/nvim-treesitter-endwise",
    event = "InsertEnter",
    dependencies = { "nvim-treesitter/nvim-treesitter" },
  },

  {
    "tarebyte/vim-ruby-minitest",
    ft = "ruby",
  },
}
