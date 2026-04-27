return {
  {
    "nvim-lualine/lualine.nvim",
    opts = function(_, opts)
      opts.options.component_separators = { left = "", right = "" }
      opts.options.section_separators = { left = "", right = "" }
      opts.options.disabled_filetypes.winbar = { "dirvish", "lazy", "snacks_dashboard" }

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

      local navic = table.remove(opts.sections.lualine_c)

      local pretty_path = table.remove(opts.sections.lualine_c) -- pretty path
      table.remove(opts.sections.lualine_c) -- filetype
      -- skip diagnostics
      table.remove(opts.sections.lualine_c, 1) -- root_dir

      opts.sections.lualine_y = { "progress" }
      opts.sections.lualine_z = { "location" }

      opts.winbar = {
        lualine_b = { pretty_path },
        lualine_c = { navic },
      }

      opts.inactive_winbar = { lualine_b = { "filename" } }
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
    "lewis6991/hover.nvim",
    opts = {
      providers = {
        "hover.providers.diagnostic",
        "hover.providers.lsp",
        "hover.providers.dap",
      },
      mouse_providers = {
        "hover.providers.diagnostic",
        "hover.providers.lsp",
        "hover.providers.dap",
      },
    },
  },
}
