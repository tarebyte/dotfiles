return {
  {
    "nvim-treesitter/nvim-treesitter",
    opts = {
      ensure_installed = {
        "css",
        "dockerfile",
        "fish",
        "git_config",
        "git_rebase",
        "gitattributes",
        "gitcommit",
        "gitignore",
        "gotmpl",
        "latex",
        "ruby",
        "scss",
        "sql",
      },
    },
  },

  -- nvim-treesitter-context comes from lazyvim.plugins.extras.ui.treesitter-context;
  -- override just the opts we care about.
  {
    "nvim-treesitter/nvim-treesitter-context",
    opts = {
      multiline_threshold = 1,
    },
  },

  {
    "nvim-treesitter/nvim-treesitter-textobjects",
    opts = {
      select = { lookahead = true },
    },
  },

  {
    "RRethy/nvim-treesitter-endwise",
    event = "InsertEnter",
    dependencies = { "nvim-treesitter/nvim-treesitter" },
  },
}
