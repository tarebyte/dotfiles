vim.diagnostic.config({
	virtual_text = {
		prefix = "",
	},
})

local signs = { Error = " ", Warn = " ", Hint = " ", Info = " " }
for type, icon in pairs(signs) do
	local hl = "DiagnosticSign" .. type
	vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
end

local colors = require("user.utils.colors")
if not colors.loaded then
	return
end

vim.cmd([[hi DiagnosticWarn guifg=]] .. colors.base0A)
