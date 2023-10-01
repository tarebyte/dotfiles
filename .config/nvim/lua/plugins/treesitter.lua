return {
  {
    "nvim-treesitter/nvim-treesitter",
    dependencies = {
      {
        "RRethy/nvim-treesitter-endwise",
        "nvim-treesitter/playground",
      },
    },
    opts = {
      endwise = {
        enable = true,
      },
      -- Also lists pre-installed languages from LazyVim
      ensure_installed = {
        -- "bash",
        -- "c",
        "comment",
        "css",
        -- "dockerfile",
        "elixir",
        "fish",
        -- "html",
        -- "javascript",
        -- "jsdoc",
        -- "json",
        -- "lua",
        -- "luadoc",
        -- "luap",
        -- "markdown",
        -- "markdown_inline",
        -- "python",
        -- "query",
        -- "regex",
        "ruby",
        -- "tsx"
        -- "typescript"
        "scss",
        "scheme",
        -- "vim",
        -- "vimdoc",
        -- "yaml",
      },
      playground = {
        enable = true,
      },
    },
  },
}
