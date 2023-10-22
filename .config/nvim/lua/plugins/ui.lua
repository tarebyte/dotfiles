return {
  {
    "nvim-tree/nvim-web-devicons",
    opts = function(_, opts)
      local ruby_icon = ""
      local ruby_color = vim.g.base16_gui08

      opts.override = {
        ["config.ru"] = {
          icon = ruby_icon,
          color = ruby_color,
          cterm_color = "52",
          name = "ConfigRu",
        },
        erb = {
          icon = "",
          color = vim.g.base16_gui08,
          cterm_color = "52",
          name = "Erb",
        },
        fish = {
          icon = "󰈺",
          color = "#4d5a5e",
          cterm_color = "59",
          name = "Fish",
        },
        rake = {
          icon = ruby_icon,
          color = ruby_color,
          cterm_color = "52",
          name = "Rake",
        },
        rb = {
          icon = ruby_icon,
          color = ruby_color,
          cterm_color = "52",
          name = "Rb",
        },
        scm = {
          icon = "󰅲",
          color = "#62B132",
          cterm_color = "34",
          name = "Scm",
        },
      }

      return opts
    end,
  },
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
          "location",
          fmt = function()
            return "Ln %l, Col %-2v"
          end,
          padding = { left = 1 },
          color = { bg = vim.g.base16_gui01 },
        },
        {
          "filetype",
          color = { bg = vim.g.base16_gui01 },
        },
      }

      -- Remove Copilot status
      local copilot = table.remove(opts.sections.lualine_x, 2)

      copilot[1] = function()
        local kinds = require("lazyvim.config").icons.kinds

        local icon = kinds.Copilot
        local status = require("copilot.api").status.data

        if status.status == "Warning" then
          icon = kinds.CopilotWarning
        end

        return icon .. (status.message or "")
      end

      copilot.color = {
        fg = (copilot.color() or vim.g.base16_gui05),
        bg = vim.g.base16_gui01,
      }
      copilot.padding = { left = 1, right = 1 }

      opts.sections.lualine_z = { copilot }

      return opts
    end,
  },
  {
    "nvimdev/dashboard-nvim",
    opts = function(_, opts)
      local logo = [[
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
      ]]

      logo = string.rep("\n", 8) .. logo .. "\n\n"

      -- Replace the Dashboard logo
      opts.config.header = vim.split(logo, "\n")

      -- Change the "Find file" icon
      opts.config.center[1].icon = " "

      return opts
    end,
  },
}
