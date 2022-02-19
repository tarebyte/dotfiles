local ok, null_ls = pcall(require, "null-ls")
if not ok then
	return
end

local code_actions = null_ls.builtins.code_actions
local completion = null_ls.builtins.completion
local diagnostics = null_ls.builtins.diagnostics
local formatting = null_ls.builtins.formatting

null_ls.setup({
	sources = {
		code_actions.gitsigns,
		diagnostics.rubocop.with({
			prefer_local = "bin/rubocop",
		}),
		formatting.rubocop.with({
			prefer_local = "bin/rubocop",
		}),
	},
})
