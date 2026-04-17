return {
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "catppuccin-nvim",
    },
  },

  {
    "catppuccin/nvim",
    opts = {
      dim_inactive = { enabled = true },
      integrations = {
        blink_cmp = { style = "bordered" },
        lualine = {
          all = function(colors)
            local function b()
              return { bg = colors.mantle, fg = colors.text }
            end
            return {
              normal = {
                a = { bg = colors.mantle, fg = colors.blue, gui = "none" },
                b = b(),
                c = { bg = colors.mantle, fg = colors.text },
              },
              insert = {
                a = { bg = colors.mantle, fg = colors.green, gui = "none" },
                b = b(),
              },
              visual = {
                a = { bg = colors.mantle, fg = colors.mauve, gui = "none" },
                b = b(),
              },
              replace = {
                a = { bg = colors.mantle, fg = colors.red, gui = "none" },
                b = b(),
              },
              command = {
                a = { bg = colors.mantle, fg = colors.peach, gui = "none" },
                b = b(),
              },
              terminal = {
                a = { bg = colors.mantle, fg = colors.green, gui = "none" },
                b = b(),
              },
              inactive = {
                a = { bg = colors.mantle, fg = colors.overlay0 },
                b = { bg = colors.mantle, fg = colors.overlay0 },
                c = { bg = colors.mantle, fg = colors.overlay0 },
              },
            }
          end,
        },
      },
      custom_highlights = function(colors)
        -- Blend hover.nvim's source-tab strip into the window bg: it uses TabLine*
        -- groups by default, which catppuccin renders darker than NormalFloat.
        vim.api.nvim_set_hl(0, "HoverSourceLine", { link = "NormalFloat" })
        vim.api.nvim_set_hl(0, "HoverInactiveSource", { link = "NormalFloat" })
        vim.api.nvim_set_hl(0, "HoverActiveSource", { link = "NormalFloat" })

        return {
          NormalFloat = { bg = colors.base },
          FloatBorder = { fg = colors.lavender, bg = "NONE" },
          ["@string.special.symbol.ruby"] = { fg = colors.maroon },
        }
      end,
    },
  },
}
