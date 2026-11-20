-- LazyVim sets its own autocmds first; this file adds ours.

-- Used by after/queries/toml/injections.scm to inject shell into mise `run` tasks.
-- Matches mise.toml, .mise.toml, mise.local.toml, and mise/config.toml.
vim.treesitter.query.add_predicate("is-mise?", function(_, _, bufnr)
  local path = vim.api.nvim_buf_get_name(tonumber(bufnr) or 0)
  return path:match("mise[^/]*%.toml$") ~= nil or path:match("/mise/[^/]*%.toml$") ~= nil
end, { force = true })
