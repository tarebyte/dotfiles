return {
	"hrsh7th/nvim-cmp",
	version = false,
	event = "InsertEnter",
	dependencies = {
		"hrsh7th/cmp-buffer",
		"hrsh7th/cmp-cmdline",
		"hrsh7th/cmp-path",
		"hrsh7th/cmp-nvim-lua",
		"saadparwaiz1/cmp_luasnip",
		{
			"petertriho/cmp-git",
			dependencies = {
				"nvim-lua/plenary.nvim",
			},
		},
		{
			"zbirenbaum/copilot-cmp",
			dependencies = {
				"zbirenbaum/copilot.lua",
				cmd = "Copilot",
				event = "InsertEnter",
				config = function()
					require("copilot").setup({
						suggestion = { enabled = false },
						panel = { enabled = false },
					})
				end,
			},
			config = function()
				require("copilot_cmp").setup()
			end,
		},
		{
			"L3MON4D3/LuaSnip",
			dependencies = {
				{
					"rafamadriz/friendly-snippets",
					config = function()
						require("luasnip.loaders.from_vscode").lazy_load()
						require("luasnip").filetype_extend("ruby", { "rails" })
					end,
				},
			},
		},
	},
	config = function()
		-- https://github.com/LunarVim/Neovim-from-scratch/blob/2683495c3df5ee7d3682897e0d47b0facb3cedc9/lua/user/cmp.lua#L13-L16
		local check_backspace = function()
			local col = vim.fn.col(".") - 1
			return col == 0 or vim.fn.getline("."):sub(col, col):match("%s")
		end

		-- https://github.com/zbirenbaum/copilot-cmp#tab-completion-configuration-highly-recommended
		local has_words_before = function()
			if vim.api.nvim_buf_get_option(0, "buftype") == "prompt" then
				return false
			end
			local line, col = unpack(vim.api.nvim_win_get_cursor(0))
			return col ~= 0 and vim.api.nvim_buf_get_text(0, line - 1, 0, line - 1, col, {})[1]:match("^%s*$") == nil
		end

		local cmp = require("cmp")
		local luasnip = require("luasnip")

		cmp.setup({
			snippet = {
				expand = function(args)
					luasnip.lsp_expand(args.body)
				end,
			},
			formatting = {
				fields = { "kind", "abbr" },
				format = function(_, vim_item)
					-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-codicons-to-the-menu
					local icons = require("user.utils.icons").codicons
					local icon = icons[vim_item.kind] or "?"

					vim_item.kind = icon .. " "

					-- https://github.com/onsails/lspkind.nvim/blob/57610d5ab560c073c465d6faf0c19f200cb67e6e/lua/lspkind/init.lua#L203-L207
					local label = vim_item.abbr
					local truncated_label = vim.fn.strcharpart(label, 0, 100)

					if truncated_label ~= label then
						vim_item.abbr = truncated_label .. "..."
					end

					return vim_item
				end,
			},
			mapping = cmp.mapping.preset.insert({
				["<C-b>"] = cmp.mapping.scroll_docs(-4),
				["<C-f>"] = cmp.mapping.scroll_docs(4),
				["<C-Space>"] = cmp.mapping.complete(),
				["<C-y>"] = cmp.config.disable,
				["<CR>"] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
				["<Tab>"] = vim.schedule_wrap(function(fallback)
					if cmp.visible() and has_words_before() then
						cmp.select_next_item({ behavior = cmp.SelectBehavior.Select })
					elseif cmp.visible() then
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
				end),
				["<S-Tab>"] = vim.schedule_wrap(function(fallback)
					if cmp.visible() then
						cmp.select_prev_item()
					elseif luasnip.jumpable(-1) then
						luasnip.jump(-1)
					else
						fallback()
					end
				end),
			}),
			-- https://github.com/hrsh7th/nvim-cmp/blob/09ff53ff579cfa3368f8051b0dbe88406891aabe/lua/cmp/config/default.lua#L62-L74
			sorting = {
				priority_weight = 2,
				comparators = {
					-- Give Copilot priority and then use the default comparators
					require("copilot_cmp.comparators").prioritize,

					cmp.config.compare.offset,
					cmp.config.compare.exact,
					-- cmp.config.compare.scopes,
					cmp.config.compare.score,
					cmp.config.compare.recently_used,
					cmp.config.compare.locality,
					cmp.config.compare.kind,
					-- cmp.config.compare.sort_text,
					cmp.config.compare.length,
					cmp.config.compare.order,
				},
			},
			sources = {
				{ name = "copilot" },
				{ name = "nvim_lsp" },
				{ name = "luasnip" },
				{ name = "buffer" },
				{ name = "nvim_lua" },
				{ name = "cmp_git" },
				{ name = "path" },
			},
			view = {
				entries = { name = "custom", selection_order = "near_cursor" },
			},
			window = {
				completion = {
					border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
					winhighlight = "Normal:Normal,FloatBorder:NormalFloat,CursorLine:PmenuSel,Search:None",
				},
				documentation = {
					border = { "╭", "─", "╮", "│", "╯", "─", "╰", "│" },
				},
			},
		})

		local completion_ok, cmp_autopairs = pcall(require, "nvim-autopairs.completion.cmp")
		if completion_ok and cmp_autopairs then
			cmp.event:on("confirm_done", cmp_autopairs.on_confirm_done({ map_char = { tex = "" } }))
		end

		require("cmp_git").setup()
	end,
}
