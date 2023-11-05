return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        rubocop = {
          mason = false,
        },
        sorbet = {
          mason = false,
        },
      },
    },
  },
}
