-- Manual LSP management: Mason disabled; servers are installed via mise/system
-- and configured inline below.

-- Shared by vscode_sorbet and vscode_sorbet_rubocop: run the given binary from
-- the repo root so the `.vscode/run-sorbet` / `bin/rubocop` relative paths
-- resolve.
local function rooted_cmd(argv)
  return function(dispatchers, config)
    local opts
    if config and config.root_dir then
      opts = { cwd = config.cmd_cwd or config.root_dir }
    end
    return vim.lsp.rpc.start(argv, dispatchers, opts)
  end
end

local function sorbet_root_dir(bufnr, on_dir)
  local root = vim.fs.root(bufnr, { ".vscode/run-sorbet" })
  if not root then
    return
  end
  on_dir(vim.fs.dirname(root))
end

local function sorbet_reuse_client(client, config)
  config.cmd_cwd = config.root_dir
  return client.config.cmd_cwd == config.cmd_cwd
end

return {
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
          cmd = { "mise", "exec", "--", "ruby-lsp" },
          -- nvim-lspconfig's default reuse_client compares `cmd_cwd`, which is
          -- only set by its default function-style `cmd`. Overriding `cmd` with
          -- a plain list leaves `cmd_cwd` nil, so the default check never
          -- matches and every Ruby buffer spawns a new client. Compare roots.
          reuse_client = function(client, config)
            return client.config.root_dir == config.root_dir
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
        -- For Ruby repos that ship a `.vscode/run-sorbet` shim (Stripe-style
        -- setups). ruby_lsp checks for the same marker and bows out so the two
        -- clients never run together.
        vscode_sorbet = {
          cmd = rooted_cmd({ ".vscode/run-sorbet", "--lsp" }),
          filetypes = { "ruby" },
          root_dir = sorbet_root_dir,
          reuse_client = sorbet_reuse_client,
        },
        -- Companion to vscode_sorbet: runs the repo's `bin/rubocop --lsp`
        -- binstub alongside Sorbet. Gated on the same marker.
        vscode_sorbet_rubocop = {
          cmd = rooted_cmd({ "bin/rubocop", "--lsp" }),
          filetypes = { "ruby" },
          root_dir = sorbet_root_dir,
          reuse_client = sorbet_reuse_client,
        },
      },
    },
  },
}
