local cmp_status_ok, cmp = pcall(require, "cmp")
if not cmp_status_ok then
	return
end

local luasnip_ok, luasnip = pcall(require, "luasnip")
if not luasnip_ok then
	return
end

local lspkind_ok, lspkind = pcall(require, "lspkind")
if not lspkind_ok then
	return
end

require("luasnip/loaders/from_vscode").lazy_load()
luasnip.filetype_extend("ruby", { "rails" })

-- https://github.com/LunarVim/Neovim-from-scratch/blob/2683495c3df5ee7d3682897e0d47b0facb3cedc9/lua/user/cmp.lua#L13-L16
local check_backspace = function()
	local col = vim.fn.col(".") - 1
	return col == 0 or vim.fn.getline("."):sub(col, col):match("%s")
end

cmp.setup({
	snippet = {
		expand = function(args)
			luasnip.lsp_expand(args.body)
		end,
	},
	formatting = {
		format = lspkind.cmp_format({ preset = "codicons" }),
	},
	mapping = cmp.mapping.preset.insert({
		["<C-b>"] = cmp.mapping.scroll_docs(-4),
		["<C-f>"] = cmp.mapping.scroll_docs(4),
		["<C-Space>"] = cmp.mapping.complete(),
		["<C-y>"] = cmp.config.disable,
		["<CR>"] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
		["<Tab>"] = function(fallback)
			if cmp.visible() then
				cmp.select_next_item()
			elseif luasnip.expandable() then
				luasnip.expand()
			elseif luasnip.expand_or_jumpable() then
				luasnip.expand_or_jump()
			elseif check_backspace() then
				fallback()
			else
				fallback()
			end
		end,
		["<S-Tab>"] = function(fallback)
			if cmp.visible() then
				cmp.select_prev_item()
			elseif luasnip.jumpable(-1) then
				luasnip.jump(-1)
			else
				fallback()
			end
		end,
	}),
	sources = {
		{ name = "nvim_lsp" },
		{ name = "nvim_lua" },
		{ name = "luasnip" },
		{ name = "buffer" },
		{ name = "cmp_git" },
		{ name = "path" },
	},
	window = {
		documentation = {
			border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
		},
	},
})

local completion_ok, cmp_autopairs = pcall(require, "nvim-autopairs.completion.cmp")
if completion_ok then
	cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done({ map_char = { tex = "" } }))
else
	return
end

require("cmp_git").setup()

local colors = require("user.utils.colors")
if not colors.loaded then
	return
end

-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-dark-theme-colors-to-the-menu
-- https://github.com/RRethy/nvim-base16/pull/42

local hi = colors.highlight

hi.CmpDocumentationBorder   = { guifg = colors.base05, guibg = colors.base00, gui = nil, guisp = nil }
hi.CmpDocumentation         = { guifg = colors.base05, guibg = colors.base00, gui = nil, guisp = nil }
hi.CmpItemAbbr              = { guifg = colors.base05, guibg = colors.base01, gui = nil, guisp = nil }
hi.CmpItemAbbrDeprecated    = { guifg = colors.base03, guibg = nil, gui = 'strikethrough', guisp = nil }
hi.CmpItemAbbrMatch         = { guifg = colors.base0D, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemAbbrMatchFuzzy    = { guifg = colors.base0D, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindDefault       = { guifg = colors.base05, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemMenu              = { guifg = colors.base04, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindKeyword       = { guifg = colors.base0E, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindVariable      = { guifg = colors.base08, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindConstant      = { guifg = colors.base09, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindReference     = { guifg = colors.base08, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindValue         = { guifg = colors.base09, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindFunction      = { guifg = colors.base0D, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindMethod        = { guifg = colors.base0D, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindConstructor   = { guifg = colors.base0D, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindClass         = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindInterface     = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindStruct        = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindEvent         = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindEnum          = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindUnit          = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindModule        = { guifg = colors.base05, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindProperty      = { guifg = colors.base08, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindField         = { guifg = colors.base08, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindTypeParameter = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindEnumMember    = { guifg = colors.base0A, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindOperator      = { guifg = colors.base05, guibg = nil, gui = nil, guisp = nil }
hi.CmpItemKindSnippet       = { guifg = colors.base04, guibg = nil, gui = nil, guisp = nil }
