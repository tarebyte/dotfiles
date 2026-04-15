-- Manual LSP management: Mason disabled; servers are installed via mise/system
-- and configured through `lsp/*.lua` files that LazyVim forwards to
-- `vim.lsp.enable()`.

return {
  { "mason-org/mason.nvim", enabled = false },
  { "mason-org/mason-lspconfig.nvim", enabled = false },

  {
    "neovim/nvim-lspconfig",
    opts = {
      diagnostics = {
        signs = {
          text = {
            [vim.diagnostic.severity.ERROR] = "▎",
            [vim.diagnostic.severity.WARN] = "▎",
            [vim.diagnostic.severity.INFO] = "▎",
            [vim.diagnostic.severity.HINT] = "▎",
          },
        },
        float = {
          border = "rounded",
          source = "if_many",
          focusable = false,
          header = "",
          prefix = "",
          wrap = true,
          max_width = 80,
        },
      },
      servers = {
        ruby_lsp = {},
        vscode_sorbet = {},
        vscode_sorbet_rubocop = {},
      },
    },
  },
}
