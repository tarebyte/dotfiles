return {
  {
    "nvim-tree/nvim-web-devicons",
    lazy = true,
    config = function()
      require("nvim-web-devicons").setup({
        override = {
          ["config.ru"] = {
            icon = "",
            color = vim.g.base16_gui08,
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
            icon = "",
            color = vim.g.base16_gui08,
            cterm_color = "52",
            name = "Rake",
          },
          rb = {
            icon = "",
            color = vim.g.base16_gui08,
            cterm_color = "52",
            name = "Rb",
          },
          scm = {
            icon = "󰅲",
            color = "#62B132",
            cterm_color = "34",
            name = "Scm",
          },
        },
      })
    end,
  },
  {
    "nvim-lualine/lualine.nvim",
    event = "VeryLazy",
    opts = function(_, opts)
      local icons = require("lazyvim.config").icons

      opts.options.component_separators = { left = "", right = "" }
      opts.options.section_separators = { left = "", right = "" }

      opts.sections.lualine_a = {
        {
          "mode",
          fmt = function(str)
            return str:sub(1, 1)
          end,
          padding = 1,
        },
      }

      opts.sections.lualine_b = {
        {
          "branch",
          icon = "",
        },
      }

      opts.sections.lualine_c = {
        {
          "diagnostics",
          symbols = {
            error = icons.diagnostics.Error,
            warn = icons.diagnostics.Warn,
            info = icons.diagnostics.Info,
            hint = icons.diagnostics.Hint,
          },
          colored = false,
          always_visible = true,
        },
        {
          "filename",
          path = 1,
          symbols = { modified = "", readonly = "", unnamed = "" },
          padding = 1,
        },
      }

      opts.sections.lualine_y = {
        {
          "location",
          fmt = function()
            return "Ln %l, Col %-2v"
          end,
          color = { bg = vim.g.base16_gui01 },
        },
        {
          "filetype",
          color = { bg = vim.g.base16_gui01 },
        },
      }

      opts.sections.lualine_z = {
        {
          function()
            local icon = ""
            local status = require("copilot.api").status.data

            if status.status == "Warning" then
              icon = ""
            end

            return icon .. (status.message or "")
          end,
          cond = function()
            local ok, clients = pcall(vim.lsp.get_active_clients, { name = "copilot", bufnr = 0 })
            return ok and #clients > 0
          end,
          color = function()
            if not package.loaded["copilot"] then
              return
            end

            local status = require("copilot.api").status.data

            if status.status == "InProgress" then
              return { fg = vim.g.base16_gui0D, bg = vim.g.base16_gui01 }
            elseif status.status == "Normal" then
              return { fg = vim.g.base16_gui05, bg = vim.g.base16_gui01 }
            elseif status.status == "Warning" then
              return { fg = vim.g.base16_gui0A, bg = vim.g.base16_gui01 }
            else
              return { fg = vim.g.base16_gui02, bg = vim.g.base16_gui01 }
            end
          end,
          padding = { left = 1, right = 2 },
        },
      }
    end,
  },
  {
    "goolord/alpha-nvim",
    opts = function()
      local dashboard = require("alpha.themes.dashboard")
      local logo = [[
           .          .
         ';;,.        ::'
       ,:::;,,        :ccc,
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

      dashboard.section.header.val = vim.split(logo, "\n")

      local find_file = dashboard.section.buttons.val[1]
      find_file.val = " " .. " Find file"

      return dashboard
    end,
  },
}
