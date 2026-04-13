-- For Ruby repos that ship a `.vscode/run-sorbet` shim (Stripe-style setups).
-- The custom `cmd` invokes that shim with `--lsp`; `ruby_lsp.lua` checks for
-- the same marker and bows out so the two clients never run together.

---@type vim.lsp.Config
return {
  cmd = function(dispatchers, config)
    local opts
    if config and config.root_dir then
      opts = { cwd = config.cmd_cwd or config.root_dir }
    end
    return vim.lsp.rpc.start({ ".vscode/run-sorbet", "--lsp" }, dispatchers, opts)
  end,
  filetypes = { "ruby" },
  root_markers = { ".vscode/run-sorbet" },
  root_dir = function(bufnr, on_dir)
    local root = vim.fs.root(bufnr, { ".vscode/run-sorbet" })
    if not root then
      return
    end
    on_dir(root)
  end,
  reuse_client = function(client, config)
    config.cmd_cwd = config.root_dir
    return client.config.cmd_cwd == config.cmd_cwd
  end,
}
