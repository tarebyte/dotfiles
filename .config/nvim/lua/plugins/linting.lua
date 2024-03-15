return {
  "mfussenegger/nvim-lint",
  opts = {
    linters_by_ft = {
      ruby = { "rubocop" },
    },
    linters = {
      rubocop = {
        cmd = "./bin/rubocop",
      },
    },
  },
}
