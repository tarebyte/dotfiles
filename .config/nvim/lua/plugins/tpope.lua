----------------------
-- All hail @tpope --
----------------------

return {
  {
    "tpope/vim-rails",
    dependencies = {
      "tpope/vim-projectionist",
    },
  },
  {
    "tpope/vim-eunuch",
    event = "VeryLazy",
  },
  {
    "tpope/vim-surround",
    event = { "BufReadPost", "BufNewFile" },
    dependencies = {
      "tpope/vim-repeat",
    },
  },
}
