---@type vim.lsp.Config
return {
  cmd = { "mise", "exec", "--", "ruby-lsp" },
  root_dir = function(bufnr, on_dir)
    local root = vim.fs.root(bufnr, { "Gemfile", ".git" })
    if not root then
      return
    end
    -- Defer to vscode_sorbet when its root marker is present.
    if vim.uv.fs_stat(root .. "/.vscode/run-sorbet") then
      return
    end
    on_dir(root)
  end,
}
