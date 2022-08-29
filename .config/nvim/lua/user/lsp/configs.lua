local mason_ok, mason = pcall(require, "mason")
local mason_lspconfig_ok, mason_lspconfig = pcall(require, "mason-lspconfig")

if not mason_ok or not mason_lspconfig_ok then
	return
end

mason.setup()

mason_lspconfig.setup({
	ensure_installed = { "sumneko_lua" },
})

-- Borrowed from https://github.com/LunarVim/Neovim-from-scratch/blob/9a928f56a118596426cc82682c7ab8ba26c88370/lua/user/lsp/configs.lua
local servers = { "sorbet", "sumneko_lua", "tsserver" }

local on_attach = require("user.lsp.handlers").on_attach
local capabilities = require("user.lsp.handlers").capabilities

for _, server in pairs(servers) do
	local opts = {
		on_attach = on_attach,
		capabilities = capabilities,
	}

	local has_custom_opts, server_custom_opts = pcall(require, "user.lsp.settings." .. server)

	if has_custom_opts then
		opts = vim.tbl_deep_extend("force", opts, server_custom_opts)
	end

	require("lspconfig")[server].setup(opts)
end
