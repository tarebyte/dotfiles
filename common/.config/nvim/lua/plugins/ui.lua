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

      local icons = LazyVim.config.icons

      opts.sections.lualine_c = {
        LazyVim.lualine.root_dir(),
        {
          "diagnostics",
          symbols = {
            error = icons.diagnostics.Error,
            warn = icons.diagnostics.Warn,
            info = icons.diagnostics.Info,
            hint = icons.diagnostics.Hint,
          },
        },
        { LazyVim.lualine.pretty_path() },
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
