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
          -- On macOS, .vscode/run-sorbet fails (no bin/bundle locally, no nproc), so run
          -- the Gemfile.lock's sorbet-static binary directly. Stdout is the LSP stream.
          cmd = vim.fn.has("mac") == 1
              and {
                "mise",
                "exec",
                "--",
                "sh",
                "-c",
                [[
v=$(sed -n 's/^    sorbet-static (\([0-9.]*\).*/\1/p' Gemfile.lock | head -1)
gem list -i sorbet-static -v "$v" >/dev/null || gem install sorbet-static -v "$v" --platform universal-darwin --no-document >&2
mkdir -p tmp/sorbet
exec "$(gem contents sorbet-static -v "$v" | grep 'libexec/sorbet$')" --lsp --cache-dir tmp/sorbet --max-threads $(( $(sysctl -n hw.ncpu) / 2 )) $(command -v watchman >/dev/null || echo --disable-watchman)
]],
              }
            or { ".vscode/run-sorbet", "--lsp" },
          filetypes = { "ruby" },
          -- A root_marker with a slash roots at .vscode/, not the repo, so go up one level.
          root_dir = function(bufnr, on_dir)
            local root = vim.fs.root(bufnr, ".vscode/run-sorbet")
            if root then
              on_dir(vim.fs.dirname(root))
            end
          end,
        },
        vscode_sorbet_rubocop = {
          -- A function cmd skips Neovim's executable check, which resolves bin/rubocop
          -- against Neovim's cwd and logs an error in every repo that has no bin/rubocop.
          cmd = function(dispatchers, config)
            return vim.lsp.rpc.start({ "bin/rubocop", "--lsp" }, dispatchers, { cwd = config.root_dir })
          end,
          filetypes = { "ruby" },
          -- A root_marker with a slash roots at .vscode/, not the repo, so go up one level.
          -- Skip repos that were not bootstrapped and so have no bin/rubocop.
          root_dir = function(bufnr, on_dir)
            local root = vim.fs.root(bufnr, ".vscode/run-sorbet")
            root = root and vim.fs.dirname(root)
            if root and vim.fn.executable(root .. "/bin/rubocop") == 1 then
              on_dir(root)
            end
          end,
        },
        -- Prose/grammar checking for prose documents only.
        --
        -- userDictPath points at the same word list `setlocal spell` uses in
        -- ftplugin/markdown.vim, so there is one personal dictionary rather
        -- than two. Note that words added through harper's code action land
        -- in that file but do not regenerate the compiled `.spl`; run
        -- `:mkspell! %` on it if Vim's own spell checker needs to agree.
        harper_ls = {
          filetypes = { "markdown", "text" },
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
