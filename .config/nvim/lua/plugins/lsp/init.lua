return {
  {
    "nvimtools/none-ls.nvim",
    opts = function()
      local nls = require("null-ls")

      return {
        sources = {
          nls.builtins.diagnostics.vale,
          nls.builtins.formatting.rubocop.with({
            prefer_local = "bin/rubocop",
          }),
          nls.builtins.diagnostics.rubocop.with({
            prefer_local = "bin/rubocop",
          }),
        },
      }
    end,
  },
}
