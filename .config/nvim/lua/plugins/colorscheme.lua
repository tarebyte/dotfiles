local Base16 = require("user.utils.base16")

return {
	"RRethy/nvim-base16",
	lazy = true,
	priority = 1000,
	config = function()
		local background = Base16.background()
		if background ~= nil then
			vim.opt.background = background
		end

		local ok, base16_colorscheme = pcall(require, "base16-colorscheme")
		if not ok then
			return
		end

		base16_colorscheme.with_config({
			telescope = false,
		})

		local colorscheme = Base16.theme()
		if colorscheme ~= nil then
			vim.cmd("colorscheme " .. colorscheme)
		end

		vim.api.nvim_set_hl(0, "@function.builtin", { fg = base16_colorscheme.colors.base0C, italic = true })
		vim.api.nvim_set_hl(0, "@keyword.return", { fg = base16_colorscheme.colors.base0E, italic = true })
		vim.api.nvim_set_hl(0, "@method.call", { fg = base16_colorscheme.colors.base0D, italic = true })
		vim.api.nvim_set_hl(0, "@tag", { fg = base16_colorscheme.colors.base08 })
		vim.api.nvim_set_hl(0, "@tag.attribute", { fg = base16_colorscheme.colors.base0A, italic = true })

		vim.api.nvim_set_hl(0, "LineNr", {
			fg = base16_colorscheme.colors.base03,
			bg = base16_colorscheme.colors.base00,
			ctermfg = 11,
		})

		vim.api.nvim_set_hl(0, "SignColumn", {
			fg = base16_colorscheme.colors.base03,
			bg = base16_colorscheme.colors.base00,
			ctermfg = 14,
			ctermbg = 242,
		})

		vim.api.nvim_set_hl(0, "StatusLine", {
			fg = base16_colorscheme.colors.base04,
			bg = base16_colorscheme.colors.base02,
			cterm = { bold = true, reverse = true },
		})

		vim.api.nvim_set_hl(0, "StatusLineNC", {
			fg = base16_colorscheme.colors.base03,
			bg = base16_colorscheme.colors.base01,
			cterm = { reverse = true },
		})

		vim.api.nvim_set_hl(0, "VertSplit", {
			fg = base16_colorscheme.colors.base02,
			bg = base16_colorscheme.colors.base02,
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

		-- Better whitespace
		vim.cmd(
			[[highlight ExtraWhitespace ctermbg=red ctermfg=white guibg=]]
				.. base16_colorscheme.colors.base08
				.. [[ guifg=]]
				.. base16_colorscheme.colors.base05
		)

		-- Conoline
		vim.g.conoline_color_normal_dark = string.format("guibg=%s", base16_colorscheme.colors.base01)
		vim.g.conoline_color_normal_nr_dark = string.format(
			"guibg=%s guifg=%s",
			base16_colorscheme.colors.base00,
			base16_colorscheme.colors.base07
		)

		-- Hide away on insert.
		vim.g.conoline_color_insert_dark = string.format("guibg=%s", base16_colorscheme.colors.base00)
		vim.g.conoline_color_insert_nr_dark = string.format(
			"guibg=%s guifg=%s",
			base16_colorscheme.colors.base00,
			base16_colorscheme.colors.base07
		)

		-- Lualine
		vim.api.nvim_set_hl(0, "SLBranch", {
			fg = base16_colorscheme.colors.base04,
			bg = base16_colorscheme.colors.base01,
			bold = true,
		})

		vim.api.nvim_set_hl(0, "SLDiagnostics", {
			fg = base16_colorscheme.colors.base04,
			bg = base16_colorscheme.colors.base01,
		})

		vim.api.nvim_set_hl(0, "SLFilename", {
			fg = base16_colorscheme.colors.base04,
			bg = base16_colorscheme.colors.base01,
		})

		vim.api.nvim_set_hl(0, "SLProgress", {
			fg = base16_colorscheme.colors.base0A,
			bg = base16_colorscheme.colors.base01,
		})

		-- Pretty fold
		vim.api.nvim_set_hl(0, "Folded", {
			fg = base16_colorscheme.colors.base03,
			ctermfg = 14,
		})

		-- Telescope
		local colors = require("user.utils.colors")
		local darker_black = colors.darken(base16_colorscheme.colors.base00, 0.06)

		vim.api.nvim_set_hl(0, "TelescopeBorder", { fg = darker_black, bg = darker_black })
		vim.api.nvim_set_hl(0, "TelescopeNormal", { bg = darker_black })
		vim.api.nvim_set_hl(0, "TelescopePromptNormal", { bg = darker_black })
	end,
}
