-- https://github.com/LazyVim/LazyVim/discussions/2263

return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        vscode_sorbet = {},
      },
      setup = {
        vscode_sorbet = function(_, opts)
          local lspconfig = require("lspconfig")
          local configs = require("lspconfig.configs")
          local util = require("lspconfig.util")

          if not configs.vscode_sorbet then
            configs.vscode_sorbet = {
              default_config = {
                cmd = {
                  ".vscode/run-sorbet",
                  "--lsp",
                },
                filetypes = {
                  "ruby",
                },
                -- root_dir = util.root_pattern("Gemfile", ".git", ".vscode/run-sorbet.sh"),
                root_dir = util.root_pattern(".vscode/run-sorbet.sh"),
              },
            }
          end

          lspconfig.vscode_sorbet.setup(opts)
        end,
      },
    },
  },
}
