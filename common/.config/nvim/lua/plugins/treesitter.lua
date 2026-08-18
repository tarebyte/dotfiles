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
}
