local Util = require("lazyvim.util")

return {
  {
    "nvim-telescope/telescope.nvim",
    dependencies = {
      "gnfisher/nvim-telescope-ctags-plus",
      config = function()
        require("telescope").load_extension("ctags_plus")
      end,
    },
    opts = {
      -- https://github.com/nvim-telescope/telescope.nvim/issues/848#issuecomment-1584291014
      defaults = vim.tbl_extend("force", require("telescope.themes").get_ivy(), {
        mappings = {
          i = {
            ["<esc>"] = require("telescope.actions").close,
          },
        },
      }),
    },
    keys = {
      -- disable the keymap to grep files
      -- https://github.com/LazyVim/LazyVim/blob/6f9adbd4fba4132bd4f12404bd2b90c4a28ff136/lua/lazyvim/plugins/editor.lua
      { "<leader><space>", false },

      { "<C-p>", Util.telescope("files"), desc = "Find Files (root dir)" },
      { "<leader>t", Util.telescope("files"), desc = "Find Files (root dir)" },
      { "<C-]>", "<cmd>lua require('telescope').extensions.ctags_plus.jump_to_tag()<cr>", desc = "CTags" },
    },
  },
}
