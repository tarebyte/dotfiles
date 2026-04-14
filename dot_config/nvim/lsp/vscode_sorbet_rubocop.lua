-- Companion to `vscode_sorbet.lua`: runs the repo's `bin/rubocop --lsp`
-- binstub alongside Sorbet in Stripe-style setups that ship
-- `.vscode/run-sorbet`. Gated on the same marker so it only activates where
-- Sorbet does.

---@type vim.lsp.Config
return {
  cmd = function(dispatchers, config)
    local opts
    if config and config.root_dir then
      opts = { cwd = config.cmd_cwd or config.root_dir }
    end
    return vim.lsp.rpc.start({ "bin/rubocop", "--lsp" }, dispatchers, opts)
  end,
  filetypes = { "ruby" },
  root_markers = { ".vscode/run-sorbet" },
  root_dir = function(bufnr, on_dir)
    local root = vim.fs.root(bufnr, { ".vscode/run-sorbet" })
    if not root then
      return
    end
    on_dir(vim.fs.dirname(root))
  end,
  reuse_client = function(client, config)
    config.cmd_cwd = config.root_dir
    return client.config.cmd_cwd == config.cmd_cwd
  end,
}
