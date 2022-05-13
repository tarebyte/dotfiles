local ok, lsp_installer = pcall(require, "nvim-lsp-installer")
if not ok then
	return
end

lsp_installer.setup({
	capabilities = require("user.lsp.handlers").capabilities,
})

local lspconfig = require("lspconfig")

lspconfig.sumneko_lua.setup({
	settings = require("user.lsp.settings.sumneko_lua"),
})
