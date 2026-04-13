-------------------
-- Plugin Loader --
-------------------

local gh = function(x)
  return "https://github.com/" .. x
end

-- Must be registered before vim.pack.add() so install hooks fire on first run.
vim.api.nvim_create_autocmd("PackChanged", {
  callback = function(ev)
    if ev.data.spec.name == "nvim-treesitter" and ev.data.kind == "install" then
      vim.cmd.packadd("nvim-treesitter")
      vim.api.nvim_create_autocmd("VimEnter", {
        once = true,
        callback = function()
          vim.cmd("TSSync")
        end,
      })
    end
  end,
})

vim.pack.add({
  {
    src = gh("catppuccin/nvim"),
    name = "catppuccin",
  },
  gh("folke/lazydev.nvim"),
  gh("folke/snacks.nvim"),
  gh("folke/which-key.nvim"),
  gh("gbprod/yanky.nvim"),
  gh("justinmk/vim-dirvish"),
  gh("kristijanhusak/vim-dirvish-git"),
  gh("lewis6991/gitsigns.nvim"),
  gh("neovim/nvim-lspconfig"),
  gh("ntpeters/vim-better-whitespace"),
  gh("nvim-lualine/lualine.nvim"),
  gh("nvim-mini/mini.pairs"),
  gh("nvim-tree/nvim-web-devicons"),
  gh("nvim-treesitter/nvim-treesitter"),
  gh("nvim-treesitter/nvim-treesitter-context"),
  gh("nvim-treesitter/nvim-treesitter-textobjects"),
  gh("rrethy/nvim-treesitter-endwise"),
  { src = gh("saghen/blink.cmp"), version = vim.version.range("1.*") },
  gh("stevearc/conform.nvim"),
  gh("tpope/vim-eunuch"),
  gh("tpope/vim-projectionist"),
  gh("tpope/vim-rails"),
  gh("tpope/vim-repeat"),
  gh("tpope/vim-surround"),
})

-------------
-- Globals --
-------------

vim.g.mapleader = ","

-- vim-better-whitespace: strip trailing whitespace on save for filetypes
-- that conform doesn't already format.
vim.g.strip_whitespace_on_save = 1
vim.g.strip_whitespace_confirm = 0
vim.g.better_whitespace_filetypes_blacklist = {
  "diff",
  "git",
  "gitcommit",
  "unite",
  "qf",
  "help",
  "markdown",
  "snacks_picker_input",
}

----------------
-- Catppuccin --
----------------

require("catppuccin").setup({
  dim_inactive = {
    enabled = true,
  },
  float = {
    transparent = false,
    solid = false,
  },
  integrations = {
    blink_cmp = {
      style = "bordered",
    },
    lualine = {
      all = function(colors)
        local function b()
          return { bg = colors.mantle, fg = colors.text }
        end
        return {
          normal = {
            a = { bg = colors.mantle, fg = colors.blue, gui = "none" },
            b = b(),
            c = { bg = colors.mantle, fg = colors.text },
          },
          insert = {
            a = { bg = colors.mantle, fg = colors.green, gui = "none" },
            b = b(),
          },
          visual = {
            a = { bg = colors.mantle, fg = colors.mauve, gui = "none" },
            b = b(),
          },
          replace = {
            a = { bg = colors.mantle, fg = colors.red, gui = "none" },
            b = b(),
          },
          command = {
            a = { bg = colors.mantle, fg = colors.peach, gui = "none" },
            b = b(),
          },
          terminal = {
            a = { bg = colors.mantle, fg = colors.green, gui = "none" },
            b = b(),
          },
          inactive = {
            a = { bg = colors.mantle, fg = colors.overlay0 },
            b = { bg = colors.mantle, fg = colors.overlay0 },
            c = { bg = colors.mantle, fg = colors.overlay0 },
          },
        }
      end,
    },
    snacks = true,
    treesitter_context = true,
    which_key = true,
  },
  lsp_styles = {
    virtual_text = {
      errors = {},
      hints = {},
      warnings = {},
      information = {},
      ok = {},
    },
    underlines = {
      errors = { "undercurl" },
      hints = { "undercurl" },
      warnings = { "undercurl" },
      information = { "undercurl" },
      ok = { "undercurl" },
    },
  },
  custom_highlights = function(colors)
    return {
      NormalFloat = { bg = colors.base },
      FloatBorder = { fg = colors.lavender, bg = "NONE" },
      ["@string.special.symbol.ruby"] = { fg = colors.maroon },
    }
  end,
})

vim.cmd.colorscheme("catppuccin-nvim")

-------------------------
-- Conform, or else... --
-------------------------

require("conform").setup({
  formatters_by_ft = {
    go = { "goimports", "gofumpt" },
    lua = { "stylua" },
  },
  format_on_save = {
    timeout_ms = 500,
    lsp_format = "fallback",
  },
})

------------
-- Snacks --
------------

require("snacks").setup({
  notifier = { enabled = true, style = "minimal" },
  statuscolumn = {
    left = { "mark", "fold" },
    right = { "sign", "git" },
  },
  picker = {
    enabled = true,
    layout = { preset = "vscode" },
    ui_select = true,
    sources = {
      files = { hidden = true, exclude = { "vendor" } },
      explorer = { hidden = true, exclude = { "vendor" } },
      grep = { exclude = { "vendor" } },
    },
    win = {
      input = {
        keys = {
          ["<Esc>"] = { "close", mode = { "n", "i" } },
        },
      },
    },
  },
})

-------------
-- LazyDev --
-------------

require("lazydev").setup({
  library = {
    { path = "${3rd}/luv/library", words = { "vim%.uv" } },
    { path = "snacks.nvim", words = { "Snacks" } },
  },
})

-----------------
-- LSP servers --
-----------------

vim.lsp.enable({ "gopls", "lua_ls", "ruby_lsp", "vscode_sorbet" })

----------------------------
-- Completion (blink.cmp) --
----------------------------

require("blink.cmp").setup({
  keymap = {
    preset = "enter",
    ["<Tab>"] = { "select_next", "fallback" },
    ["<S-Tab>"] = { "select_prev", "fallback" },
  },
  appearance = {
    nerd_font_variant = "mono",
  },
  sources = {
    default = { "lsp", "path", "buffer" },
  },
  completion = {
    documentation = {
      auto_show = true,
      auto_show_delay_ms = 200,
    },
  },
})

----------------
-- mini.pairs --
----------------

require("mini.pairs").setup()

---------------
-- which-key --
---------------

require("which-key").setup({
  preset = "helix",
})

-------------
-- Lualine --
-------------

vim.api.nvim_create_autocmd("LspProgress", {
  callback = function()
    require("lualine").refresh()
  end,
})

require("lualine").setup({
  options = {
    globalstatus = vim.o.laststatus == 3,
    section_separators = "",
    theme = "catppuccin-nvim",
    component_separators = "",
  },
  sections = {
    lualine_a = {
      {
        "mode",
        fmt = function(str)
          return str:sub(1, 1)
        end,
      },
    },
    lualine_b = {
      {
        "branch",
        icon = "",
      },
    },
    lualine_x = {
      "diagnostics",
      {
        "lsp_status",
        icon = "",
        symbols = {
          done = "󰅩",
        },
        show_name = false,
        padding = { left = 1, right = 1 },
      },
      {
        "filetype",
        icons_enabled = false,
        padding = { left = 0, right = 1 },
      },
    },
    lualine_y = { "progress" },
    lualine_z = { "location" },
  },
})

-----------------------
-- nvim-web-devicons --
-----------------------

require("nvim-web-devicons").setup({
  override = {
    rb = {
      icon = "",
    },
  },
})

-----------
-- Yanky --
-----------

require("yanky").setup({
  ring = {
    storage = "shada", -- persist yank history across sessions
  },
})

--------------
-- Gitsigns --
--------------

require("gitsigns").setup({
  on_attach = function(buf)
    local gs = require("gitsigns")
    require("which-key").add({
      buffer = buf,
      {
        "]h",
        function()
          gs.nav_hunk("next")
        end,
        desc = "Next hunk",
      },
      {
        "[h",
        function()
          gs.nav_hunk("prev")
        end,
        desc = "Prev hunk",
      },
      { "<leader>ghs", gs.stage_hunk, desc = "Stage hunk" },
      { "<leader>ghr", gs.reset_hunk, desc = "Reset hunk" },
      { "<leader>ghp", gs.preview_hunk, desc = "Preview hunk" },
      {
        "<leader>ghb",
        function()
          gs.blame_line({ full = true })
        end,
        desc = "Blame line",
      },
    })
  end,
})

------------------------
-- Treesitter Context --
------------------------

require("treesitter-context").setup({
  max_lines = 3,
  multiline_threshold = 1,
})

----------------------------
-- Treesitter Textobjects --
----------------------------

require("nvim-treesitter-textobjects").setup({
  select = { lookahead = true },
  move = { set_jumps = true },
})
-- Keymaps for textobjects live in plugin/keymaps.lua.
