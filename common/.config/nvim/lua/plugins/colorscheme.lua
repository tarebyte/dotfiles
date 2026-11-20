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
      float = { solid = true },
      integrations = {
        blink_cmp = { style = "bordered" },
        dropbar = { enabled = true, color_mode = true }, -- color breadcrumbs by symbol kind
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
          -- hover.nvim's source-tab row uses TabLine* by default, a darker strip than the
          -- float. Blend it in and show the active source like other float titles.
          HoverSourceLine = { link = "NormalFloat" },
          HoverInactiveSource = { link = "NormalFloat" },
          HoverActiveSource = { link = "FloatTitle" },
          -- Solid floats hide borders (mantle on mantle). The Zed-style picker in
          -- plugins/ui.lua needs the rule under its prompt to show.
          SnacksPickerInputBorder = { fg = colors.surface0, bg = colors.mantle },
          -- Catppuccin style guide: symbols are red, properties/keys are blue.
          -- The .ruby group is set separately because catppuccin overrides it.
          ["@string.special.symbol"] = { fg = colors.red },
          ["@string.special.symbol.ruby"] = { fg = colors.red },
          -- Ruby hash keys and keyword args (captured in after/queries/ruby/highlights.scm).
          ["@property.ruby"] = { fg = colors.blue },
          -- Zed-style breadcrumb bar: editor background with a thin surface0 line at the bottom,
          -- drawn as a colored underline across the row (see the winbar in plugins/ui.lua).
          WinBar = { fg = colors.text, style = { "underline" }, sp = colors.surface0 },
          WinBarSeparator = { fg = colors.overlay2, style = { "underline" }, sp = colors.surface0 },
          -- More style guide rows where catppuccin-nvim differs.
          LineNr = { fg = colors.overlay1 },
          DiagnosticInfo = { fg = colors.teal },
          DiagnosticSignInfo = { fg = colors.teal },
          DiagnosticFloatingInfo = { fg = colors.teal },
          DiagnosticUnderlineInfo = { sp = colors.teal },
          diffLine = { fg = colors.peach },
          ["@function.macro"] = { fg = colors.rosewater },
          ["@constant.macro"] = { fg = colors.rosewater },
        }
      end,
    },
  },
}
