local mason_ok, mason = pcall(require, "mason")
local mason_lspconfig_ok, mason_lspconfig = pcall(require, "mason-lspconfig")
if not mason_ok or not mason_lspconfig_ok then
	return
end

mason.setup()

mason_lspconfig.setup({
	ensure_installed = { "sorbet", "sumneko_lua" },
	capabilities = require("user.lsp.handlers").capabilities,
})

local lspconfig = require("lspconfig")

lspconfig.sumneko_lua.setup({
	settings = require("user.lsp.settings.sumneko_lua"),
})

lspconfig.sorbet.setup({})
