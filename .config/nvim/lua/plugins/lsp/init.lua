return {
	{
		"folke/neoconf.nvim",
		lazy = false,
		opts = {}
	},
	{
		"folke/neodev.nvim", opts = {}
	},
	{
		"neovim/nvim-lspconfig",
		event = { "BufReadPre", "BufNewFile" },
		dependencies = {
			"hrsh7th/cmp-nvim-lsp",
			{
				"weilbith/nvim-code-action-menu",
				cmd = "CodeActionMenu",
			},
		},
		opts = {
			diagnostics = {
				virtual_text = {
					prefix = "",
				},
				update_in_insert = true,
				underline = true,
				severity_sort = true,
				float = {
					focusable = false,
					style = "minimal",
					border = "rounded",
					source = "always",
					header = "",
					prefix = "",
				},
			},
			servers = {
				lua_ls = {
					settings = {
						Lua = {
							runtime = {
								-- Tell the language server which version of Lua you're using (most likely LuaJIT in the case of Neovim)
								version = "LuaJIT",
							},
							diagnostics = {
								-- Get the language server to recognize the `vim` global
								globals = { "vim" },
							},
							workspace = {
								-- Make the server aware of Neovim runtime files
								library = vim.api.nvim_get_runtime_file("", true),
							},
							-- Do not send telemetry data containing a randomized but unique identifier
							telemetry = {
								enable = false,
							},
						},
					},
				},
			},
		},
		config = function(_, opts)
			local signs = {
				{ name = "DiagnosticSignError", icon = "" },
				{ name = "DiagnosticSignWarn", icon = "" },
				{ name = "DiagnosticSignHint", icon = "" },
				{ name = "DiagnosticSignInfo", icon = "" },
			}

			for _, sign in ipairs(signs) do
				vim.fn.sign_define(sign.name, { texthl = sign.name, text = sign.icon, numhl = "" })
			end

			vim.diagnostic.config(opts.diagnostics)

			local on_attach = require("plugins.lsp.handlers").on_attach()
			local capabilities = require("cmp_nvim_lsp").default_capabilities()

			for server, server_opts in pairs(opts.servers) do
				local optz = vim.tbl_deep_extend("force", {
					on_attach = on_attach,
					capabilities = capabilities,
				}, server_opts)

				require("lspconfig")[server].setup(optz)
			end

			vim.lsp.handlers["textDocument/hover"] = vim.lsp.with(vim.lsp.handlers.hover, {
				border = "rounded",
			})

			vim.lsp.handlers["textDocument/signatureHelp"] = vim.lsp.with(vim.lsp.handlers.signature_help, {
				border = "rounded",
			})
		end,
	},
	{
		"jose-elias-alvarez/null-ls.nvim",
		event = { "BufReadPre", "BufNewFile" },
		opts = function()
			local null_ls = require("null-ls")

			local code_actions = null_ls.builtins.code_actions
			local diagnostics = null_ls.builtins.diagnostics
			local formatting = null_ls.builtins.formatting

			return {
				sources = {
					code_actions.gitsigns,
					code_actions.eslint,
					code_actions.shellcheck,

					diagnostics.eslint,
					diagnostics.shellcheck,
					diagnostics.vale,

					diagnostics.rubocop.with({
						prefer_local = "bin/rubocop",
					}),

					formatting.eslint,
					formatting.fish_indent,

					formatting.rubocop.with({
						prefer_local = "bin/rubocop",
					}),
				},
			}
		end,
	},
}
