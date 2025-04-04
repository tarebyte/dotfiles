return {
  {
    "ibhagwan/fzf-lua",
    opts = function(_, _)
      return {
        "ivy",
        "hide",
      }
    end,
    keys = {
      -- disable the keymap to grep files
      -- https://github.com/LazyVim/LazyVim/blob/ec5981dfb1222c3bf246d9bcaa713d5cfa486fbd/lua/lazyvim/plugins/extras/editor/fzf.lua#L218
      { "<leader><space>", false },

      { "<C-p>", LazyVim.pick("files"), desc = "Find Files (Root Dir)" },
      { "<leader>t", LazyVim.pick("files"), desc = "Find Files (Root Dir)" },
    },
  },
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
      { "<Leader>cs", "<cmd>StripWhitespace<cr>", "", desc = "Clean up trailing whitespace" },
    },
  },
}
