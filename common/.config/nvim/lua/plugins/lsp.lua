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
          init_options = {
            addonSettings = {
              ["Ruby LSP Rails"] = {
                enablePendingMigrationsPrompt = false,
              },
            },
          },
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
        -- Prose/grammar checking. Attaches to markdown and to comments and
        -- strings in the ~28 filetypes nvim-lspconfig declares by default.
        --
        -- userDictPath points at the same word list `setlocal spell` uses in
        -- ftplugin/markdown.vim, so there is one personal dictionary rather
        -- than two. Note that words added through harper's code action land
        -- in that file but do not regenerate the compiled `.spl`; run
        -- `:mkspell! %` on it if Vim's own spell checker needs to agree.
        harper_ls = {
          settings = {
            ["harper-ls"] = {
              userDictPath = vim.fn.stdpath("config") .. "/spell/en.utf-8.add",
              linters = {
                -- Off by default here: code comments and commit subjects
                -- routinely start lowercase, which this flags on every line.
                SentenceCapitalization = false,
              },
            },
          },
        },
      },
    },
  },
}
