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
		end
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
		}
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
--
-- gray
vim.cmd([[highlight! CmpItemAbbrDeprecated guibg=NONE gui=strikethrough guifg=]] .. colors.base03)

-- blue
vim.cmd([[highlight! CmpItemAbbrMatch guibg=NONE guifg=]] .. colors.base0D)
vim.cmd([[highlight! CmpItemAbbrMatchFuzzy guibg=NONE guifg=]] .. colors.base0D)

-- cyan
vim.cmd([[highlight! CmpItemKindVariable guibg=NONE guifg=]] .. colors.base0C)
vim.cmd([[highlight! CmpItemKindInterface guibg=NONE guifg=]] .. colors.base0C)
vim.cmd([[highlight! CmpItemKindText guibg=NONE guifg=]] .. colors.base0C)

-- magenta
vim.cmd([[highlight! CmpItemKindFunction guibg=NONE guifg=]] .. colors.base0E)
vim.cmd([[highlight! CmpItemKindMethod guibg=NONE guifg=]] .. colors.base0E)

-- front
vim.cmd([[highlight! CmpItemKindKeyword guibg=NONE guifg=]] .. colors.base06)
vim.cmd([[highlight! CmpItemKindProperty guibg=NONE guifg=]] .. colors.base06)
vim.cmd([[highlight! CmpItemKindUnit guibg=NONE guifg=]] .. colors.base06)
