return {
  {
    "nvim-lualine/lualine.nvim",
    opts = function(_, opts)
      opts.options.component_separators = { left = "", right = "" }
      opts.options.section_separators = { left = "", right = "" }

      opts.sections.lualine_a = {
        {
          "mode",
          fmt = function(str)
            return str:sub(1, 1)
          end,
        },
      }

      opts.sections.lualine_b = {
        { "branch", icon = "" },
      }

      -- Remove file type icon
      -- https://github.com/LazyVim/LazyVim/blob/fa3170d422f3c661d0411472c96f92e5324dc281/lua/lazyvim/plugins/ui.lua#L153
      table.remove(opts.sections.lualine_c, 3)

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
}
