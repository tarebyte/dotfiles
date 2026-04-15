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
      float = { transparent = false, solid = false },
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
        return {
          NormalFloat = { bg = colors.base },
          FloatBorder = { fg = colors.lavender, bg = "NONE" },
          ["@string.special.symbol.ruby"] = { fg = colors.maroon },
        }
      end,
    },
  },
}
