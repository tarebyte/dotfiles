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
        {
          "branch",
          icon = "",
        },
      }

      -- Disable colors for "diagnostics" section
      -- https://github.com/LazyVim/LazyVim/blob/fa3170d422f3c661d0411472c96f92e5324dc281/lua/lazyvim/plugins/ui.lua#L144-L152
      opts.sections.lualine_c[2].colored = false

      -- Remove file type icon
      -- https://github.com/LazyVim/LazyVim/blob/fa3170d422f3c661d0411472c96f92e5324dc281/lua/lazyvim/plugins/ui.lua#L153
      table.remove(opts.sections.lualine_c, 3)

      opts.sections.lualine_y = {
        {
          function()
            local cur = vim.fn.line(".")
            local total = vim.fn.line("$")

            local chars = {
              "   ",
              "▁▁▁",
              "▂▂▂",
              "▂▂▂",
              "▃▃▃",
              "▄▄▄",
              "▅▅▅",
              "▆▆▆",
              "▇▇▇",
              "███",
            }

            local line_ratio = cur / total
            local index = math.ceil(line_ratio * #chars)

            return chars[index]
          end,
          padding = { left = 0, right = 0 },
        },
      }

      opts.sections.lualine_z = { "location" }

      return opts
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
      scroll = { enabled = false },
    },
  },
}
