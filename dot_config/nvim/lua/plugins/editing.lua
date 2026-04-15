return {
  { "tpope/vim-surround", event = "VeryLazy" },
  { "tpope/vim-repeat", event = "VeryLazy" },
  { "tpope/vim-eunuch", cmd = { "Delete", "Mkdir", "Move", "Rename", "Unlink", "Wall" } },

  {
    "tpope/vim-projectionist",
    event = "VeryLazy",
  },

  {
    "tpope/vim-rails",
    ft = { "ruby", "eruby", "yaml" },
    dependencies = { "tpope/vim-projectionist" },
  },

  {
    "ntpeters/vim-better-whitespace",
    event = "VeryLazy",
    init = function()
      vim.g.strip_whitespace_on_save = 1
      vim.g.strip_whitespace_confirm = 0
      vim.g.better_whitespace_filetypes_blacklist = {
        "diff",
        "git",
        "gitcommit",
        "unite",
        "qf",
        "help",
        "markdown",
        "snacks_picker_input",
      }
    end,
  },

  {
    "justinmk/vim-dirvish",
    lazy = false,
  },

  {
    "kristijanhusak/vim-dirvish-git",
    dependencies = { "justinmk/vim-dirvish" },
    event = "VeryLazy",
  },
}
