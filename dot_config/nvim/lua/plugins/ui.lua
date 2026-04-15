return {
  {
    "nvim-lualine/lualine.nvim",
    opts = function(_, opts)
      opts.options = vim.tbl_extend("force", opts.options or {}, {
        section_separators = "",
        component_separators = "",
        theme = "catppuccin-nvim",
      })
      opts.sections.lualine_a = {
        {
          "mode",
          fmt = function(str)
            return str:sub(1, 1)
          end,
        },
      }
      opts.sections.lualine_b = {
        { "branch", icon = "" },
      }
      opts.sections.lualine_x = {
        "diagnostics",
        {
          "lsp_status",
          icon = "",
          symbols = { done = "󰅩" },
          show_name = false,
          padding = { left = 1, right = 1 },
        },
        {
          "filetype",
          icons_enabled = false,
          padding = { left = 0, right = 1 },
        },
      }
      opts.sections.lualine_y = { "progress" }
      opts.sections.lualine_z = { "location" }
    end,
  },

  {
    "folke/snacks.nvim",
    opts = {
      dashboard = {
        preset = {
          header = [[
    .        .
    ';;,.       ::'
    ,:::;,,       :ccc,
  ,::c::,,,,.     :cccc,
  ,cccc:;;;;;.    cllll,
  ,cccc;.;;;;;,   cllll;
  :cccc; .;;;;;;. coooo;
  ;llll;   ,:::::'loooo;
  ;llll:    ':::::loooo:
  :oooo:     .::::llodd:
  .;ooo:       ;cclooo:.
  .;oc        'coo;.
  .'         .,.
]],
        },
      },
      explorer = { replace_netrw = false },
      notifier = { style = "minimal" },
      scroll = { enabled = false },
      statuscolumn = {
        left = { "mark", "fold" },
        right = { "sign", "git" },
      },
      picker = {
        layout = { preset = "vscode" },
        ui_select = true,
        sources = {
          files = { hidden = true, exclude = { "vendor" } },
          explorer = { hidden = true, exclude = { "vendor" } },
          grep = { exclude = { "vendor" } },
        },
        win = {
          input = {
            keys = {
              ["<Esc>"] = { "close", mode = { "n", "i" } },
            },
          },
        },
      },
    },
  },

  {
    "nvim-tree/nvim-web-devicons",
    opts = {
      override = {
        rb = { icon = "" },
      },
    },
  },

  { "nvim-neo-tree/neo-tree.nvim", enabled = false },
  { "akinsho/bufferline.nvim", enabled = false },
}
