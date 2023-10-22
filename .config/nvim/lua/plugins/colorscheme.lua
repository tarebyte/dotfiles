return {
  "RRethy/nvim-base16",
  lazy = false,
  priority = 1000,
  config = function()
    local base16_colorscheme = require("base16-colorscheme")

    base16_colorscheme.with_config({
      telescope_borders = true,
    })

    vim.cmd("colorscheme base16-ocean")

    vim.api.nvim_set_hl(0, "@function.builtin", { fg = vim.g.base16_gui0C, italic = true })
    vim.api.nvim_set_hl(0, "@keyword.return", { fg = vim.g.base16_gui0E, italic = true })
    vim.api.nvim_set_hl(0, "@method.call", { fg = vim.g.base16_gui0D, italic = true })
    vim.api.nvim_set_hl(0, "@tag", { fg = vim.g.base16_gui08 })
    vim.api.nvim_set_hl(0, "@tag.attribute", { fg = vim.g.base16_gui0A, italic = true })

    vim.api.nvim_set_hl(0, "Italic", { italic = true })

    vim.api.nvim_set_hl(0, "LineNr", {
      fg = vim.g.base16_gui03,
      bg = vim.g.base16_gui00,
      ctermfg = 11,
    })

    vim.api.nvim_set_hl(0, "SignColumn", {
      fg = vim.g.base16_gui03,
      bg = vim.g.base16_gui00,
      ctermfg = 14,
      ctermbg = 242,
    })

    vim.api.nvim_set_hl(0, "StatusLine", {
      fg = vim.g.base16_gui04,
      bg = vim.g.base16_gui02,
      cterm = { bold = true, reverse = true },
    })

    vim.api.nvim_set_hl(0, "StatusLineNC", {
      fg = vim.g.base16_gui03,
      bg = vim.g.base16_gui01,
      cterm = { reverse = true },
    })

    vim.api.nvim_set_hl(0, "VertSplit", {
      fg = vim.g.base16_gui02,
    })

    -----------------------
    -- Language specific --
    -----------------------

    -- HTML
    vim.api.nvim_set_hl(0, "@tag.delimiter.html", { link = "Normal" })

    -- Ruby
    vim.api.nvim_set_hl(0, "@punctuation.special.ruby", { link = "Boolean" })

    -------------
    -- Plugins --
    -------------

    local colors = require("user.utils.colors")
    local darker_black = colors.darken(vim.g.base16_gui00, 0.06)

    -- dashboard-nvim
    vim.api.nvim_set_hl(0, "DashboardIcon", { fg = vim.g.base16_gui0C })
    vim.api.nvim_set_hl(0, "DashboardKey", { fg = vim.g.base16_gui09 })

    -- Better whitespace
    vim.cmd(
      [[highlight ExtraWhitespace ctermbg=red ctermfg=white guibg=]]
        .. vim.g.base16_gui08
        .. [[ guifg=]]
        .. vim.g.base16_gui05
    )

    -- nvim-cmp
    vim.api.nvim_set_hl(0, "CmpItemAbbr", { fg = vim.g.base16_gui05, bg = vim.g.base16_gui00 })
    vim.api.nvim_set_hl(0, "CmpItemKindCopilot", { fg = vim.g.base16_gui0B })

    -- Hide away on insert.
    vim.g.conoline_color_insert_dark = string.format("guibg=%s", vim.g.base16_gui00)
    vim.g.conoline_color_insert_nr_dark = string.format("guibg=%s guifg=%s", vim.g.base16_gui00, vim.g.base16_gui07)

    -- Telescope
    vim.api.nvim_set_hl(0, "TelescopeBorder", { fg = darker_black, bg = darker_black })
    vim.api.nvim_set_hl(0, "TelescopePromptBorder", { fg = darker_black, bg = darker_black })
    vim.api.nvim_set_hl(0, "TelescopeNormal", { bg = darker_black })
    vim.api.nvim_set_hl(0, "TelescopePromptNormal", { bg = darker_black })

    vim.api.nvim_set_hl(0, "TelescopePreviewTitle", { fg = vim.g.base16_gui0B, bg = darker_black })
    vim.api.nvim_set_hl(0, "TelescopePromptTitle", { fg = vim.g.base16_gui08, bg = darker_black })
    vim.api.nvim_set_hl(0, "TelescopeResultsTitle", { fg = vim.g.base16_gui0A, bg = darker_black })
  end,
}
