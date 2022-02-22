local ok, _ = pcall(require, "lspconfig")
if not ok then
	return
end

require("user.lsp.lsp-installer")
require("user.lsp.handlers").setup()
require("user.lsp.null-ls")
