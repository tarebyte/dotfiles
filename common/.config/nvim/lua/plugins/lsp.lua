return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      inlay_hints = { enabled = false },
      diagnostics = {
        signs = {
          text = {
            [vim.diagnostic.severity.ERROR] = "▎",
            [vim.diagnostic.severity.WARN] = "▎",
            [vim.diagnostic.severity.INFO] = "▎",
            [vim.diagnostic.severity.HINT] = "▎",
          },
        },
        virtual_text = false,
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
        ruby_lsp = {
          mason = false,
          cmd = function(dispatchers)
            local argv = vim.fn.executable("mise") == 1 and { "mise", "exec", "--", "ruby-lsp" } or { "ruby-lsp" }
            return vim.lsp.rpc.start(argv, dispatchers)
          end,
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
        },
        tailwindcss = {},
        vscode_sorbet = {
          cmd = { ".vscode/run-sorbet", "--lsp" },
          filetypes = { "ruby" },
          root_markers = { ".vscode/run-sorbet" },
        },
        vscode_sorbet_rubocop = {
          cmd = { "bin/rubocop", "--lsp" },
          filetypes = { "ruby" },
          root_markers = { ".vscode/run-sorbet" },
        },
      },
    },
  },
}
