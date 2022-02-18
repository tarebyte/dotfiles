local cmp_status_ok, cmp = pcall(require, "cmp")
if not cmp_status_ok then
	return
end

local ok, cmp_git = pcall(require, "cmp_git")
if not ok then
	return
end

-- https://github.com/LunarVim/Neovim-from-scratch/blob/2683495c3df5ee7d3682897e0d47b0facb3cedc9/lua/user/cmp.lua#L13-L16
local check_backspace = function()
	local col = vim.fn.col(".") - 1
	return col == 0 or vim.fn.getline("."):sub(col, col):match("%s")
end

-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-codicons-to-the-menu
local cmp_kinds = {
	Text = "  ",
	Method = "  ",
	Function = "  ",
	Constructor = "  ",
	Field = "  ",
	Variable = "  ",
	Class = "  ",
	Interface = "  ",
	Module = "  ",
	Property = "  ",
	Unit = "  ",
	Value = "  ",
	Enum = "  ",
	Keyword = "  ",
	Snippet = "  ",
	Color = "  ",
	File = "  ",
	Reference = "  ",
	Folder = "  ",
	EnumMember = "  ",
	Constant = "  ",
	Struct = "  ",
	Event = "  ",
	Operator = "  ",
	TypeParameter = "  ",
}

cmp.setup({
	formatting = {
		fields = { "kind", "abbr" },
		format = function(_, vim_item)
			vim_item.kind = cmp_kinds[vim_item.kind] or ""
			return vim_item
		end,
	},
	mapping = {
		["<C-b>"] = cmp.mapping(cmp.mapping.scroll_docs(-4), { "i", "c" }),
		["<C-f>"] = cmp.mapping(cmp.mapping.scroll_docs(4), { "i", "c" }),
		["<C-Space>"] = cmp.mapping(cmp.mapping.complete(), { "i", "c" }),
		["<C-y>"] = cmp.config.disable, -- Specify `cmp.config.disable` if you want to remove the default `<C-y>` mapping.
		["<C-e>"] = cmp.mapping({
			i = cmp.mapping.abort(),
			c = cmp.mapping.close(),
		}),
		["<CR>"] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.

		["<Tab>"] = cmp.mapping(function(fallback)
			if cmp.visible() then
				cmp.select_next_item()
			elseif check_backspace() then
				cmp.complete()
			else
				fallback()
			end
		end, { "i", "s" }),

		["<S-Tab>"] = cmp.mapping(function(fallback)
			if cmp.visible() then
				cmp.select_prev_item()
			else
				fallback()
			end
		end, { "i", "s" }),
	},
	sources = {
		{ name = "buffer" },
		{ name = "cmp_git" },
		{ name = "path" },
	},
	documentation = {
		border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
	},
})

local ok, cmp_autopairs = pcall(require, "nvim-autopairs.completion.cmp")
if ok then
	cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done({ map_char = { tex = "" } }))
else
	return
end

cmp_git.setup()

local colors = require("user.utils.colors")

-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-dark-theme-colors-to-the-menu
vim.cmd([[
  " gray
  highlight! CmpItemAbbrDeprecated guibg=NONE gui=strikethrough guifg=${colors.base03}

  " blue
  highlight! CmpItemAbbrMatch guibg=NONE guifg=${colors.base0D}
  highlight! CmpItemAbbrMatchFuzzy guibg=NONE guifg=${colors.base0D}

  " cyan
  highlight! CmpItemKindVariable guibg=NONE guifg=${colors.base0C}
  highlight! CmpItemKindInterface guibg=NONE guifg=${colors.base0C}
  highlight! CmpItemKindText guibg=NONE guifg=${colors.base0C}

  " magenta
  highlight! CmpItemKindFunction guibg=NONE guifg=${colors.base0E}
  highlight! CmpItemKindMethod guibg=NONE guifg=${colors.base0E}

  " front
  highlight! CmpItemKindKeyword guibg=NONE guifg=${colors.base06}
  highlight! CmpItemKindProperty guibg=NONE guifg=${colors.base06}
  highlight! CmpItemKindUnit guibg=NONE guifg=${colors.base06}
]])
