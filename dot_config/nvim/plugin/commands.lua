-- Neovim 0.11+ ships `:lsp enable|disable|stop|restart` natively
-- (see :h :lsp-enable). Only the `:LspInfo` / `:LspLog` shortcuts live here.

vim.api.nvim_create_user_command("LspInfo", "checkhealth vim.lsp", {
  desc = "LSP health",
})

vim.api.nvim_create_user_command("LspLog", function()
  vim.cmd.tabnew(vim.lsp.log.get_filename())
end, { desc = "Open the LSP client log in a new tab" })
