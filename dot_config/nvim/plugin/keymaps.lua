local wk = require("which-key")

wk.add({
  -- Top-level
  { "<C-p>", function() Snacks.picker.files() end, desc = "Find files", mode = "n" },
  { "<leader>t", function() Snacks.picker.files() end, desc = "Find files", mode = "n" },
  { "<leader>?", function() wk.show({ global = false }) end, desc = "Buffer local keymaps" },
  { "<leader><space>", function() Snacks.picker.files() end, desc = "Find files" },
  { "<leader>,", function() Snacks.picker.buffers() end, desc = "Buffers" },
  { "<leader>:", function() Snacks.picker.command_history() end, desc = "Command history" },
  { "<leader>/", function() Snacks.picker.grep() end, desc = "Grep" },

  -- Editing
  { "go", "o<Esc>", desc = "Insert blank line below", mode = "n" },
  { "gO", "O<Esc>", desc = "Insert blank line above", mode = "n" },
  { "<leader>O", function() require("vim.treesitter._headings").show_toc() end, desc = "Show outline (TOC)" },

  -- Jump groups (populated by gitsigns / LSP / textobjects below and on-attach)
  { "]", group = "next" },
  { "[", group = "prev" },

  -- Treesitter text objects (nvim-treesitter-textobjects)
  { "af", function() require("nvim-treesitter-textobjects.select").select_textobject("@function.outer", "textobjects") end, desc = "a function", mode = { "x", "o" } },
  { "if", function() require("nvim-treesitter-textobjects.select").select_textobject("@function.inner", "textobjects") end, desc = "inner function", mode = { "x", "o" } },
  { "ac", function() require("nvim-treesitter-textobjects.select").select_textobject("@class.outer", "textobjects") end, desc = "a class", mode = { "x", "o" } },
  { "ic", function() require("nvim-treesitter-textobjects.select").select_textobject("@class.inner", "textobjects") end, desc = "inner class", mode = { "x", "o" } },
  { "]f", function() require("nvim-treesitter-textobjects.move").goto_next_start("@function.outer", "textobjects") end, desc = "Next function start", mode = { "n", "x", "o" } },
  { "[f", function() require("nvim-treesitter-textobjects.move").goto_previous_start("@function.outer", "textobjects") end, desc = "Prev function start", mode = { "n", "x", "o" } },
  { "]F", function() require("nvim-treesitter-textobjects.move").goto_next_end("@function.outer", "textobjects") end, desc = "Next function end", mode = { "n", "x", "o" } },
  { "[F", function() require("nvim-treesitter-textobjects.move").goto_previous_end("@function.outer", "textobjects") end, desc = "Prev function end", mode = { "n", "x", "o" } },

  -- Code (LSP, see plugin/autocmds.lua for buffer-local bindings)
  { "<leader>c", group = "code" },

  -- Buffer management
  { "<leader>b", group = "buffer" },
  { "<leader>bd", function() Snacks.bufdelete() end, desc = "Delete buffer" },
  { "<leader>bo", function() Snacks.bufdelete.other() end, desc = "Delete other buffers" },

  -- Find / Files
  { "<leader>f", group = "find" },
  { "<leader>fa", "<cmd>A<cr>", desc = "Alternate file" },
  { "<leader>ff", function() Snacks.picker.files() end, desc = "Find files" },
  { "<leader>fb", function() Snacks.picker.buffers() end, desc = "Buffers" },
  { "<leader>fg", function() Snacks.picker.git_files() end, desc = "Find git files" },
  { "<leader>fr", function() Snacks.picker.recent() end, desc = "Recent files" },

  -- Search
  { "<leader>s", group = "search" },
  { "<leader>sg", function() Snacks.picker.grep() end, desc = "Live grep" },
  { "<leader>sw", function() Snacks.picker.grep_word() end, desc = "Grep word/selection", mode = { "n", "x" } },
  { "<leader>sb", function() Snacks.picker.lines() end, desc = "Buffer lines" },
  { "<leader>sd", function() Snacks.picker.diagnostics() end, desc = "Diagnostics" },
  { "<leader>sk", function() Snacks.picker.keymaps() end, desc = "Keymaps" },
  { "<leader>sh", function() Snacks.picker.help() end, desc = "Help pages" },
  { "<leader>ss", function() Snacks.picker.lsp_symbols() end, desc = "LSP symbols" },
  { "<leader>sS", function() Snacks.picker.lsp_workspace_symbols() end, desc = "LSP workspace symbols" },
  { "<leader>sR", function() Snacks.picker.resume() end, desc = "Resume last picker" },
  { "<leader>su", function() Snacks.picker.undo() end, desc = "Undotree" },
  { "<leader>s\"", function() Snacks.picker.registers() end, desc = "Registers" },
  { "<leader>sm", function() Snacks.picker.marks() end, desc = "Marks" },

  -- Git
  { "<leader>g", group = "git" },
  { "<leader>gh", group = "hunk" },
  { "<leader>gg", function() Snacks.lazygit() end, desc = "Lazygit" },
  { "<leader>gb", function() Snacks.picker.git_log_line() end, desc = "Git blame line" },
  { "<leader>gf", function() Snacks.picker.git_log_file() end, desc = "File history" },
  { "<leader>gl", function() Snacks.picker.git_log() end, desc = "Git log" },
  { "<leader>gs", function() Snacks.picker.git_status() end, desc = "Git status" },
  { "<leader>gd", function() Snacks.picker.git_diff() end, desc = "Git diff (hunks)" },
  { "<leader>gB", function() Snacks.gitbrowse() end, desc = "Open in browser", mode = { "n", "x" } },
  { "<leader>gY", function() Snacks.gitbrowse({ open = function(url) vim.fn.setreg("+", url) end }) end, desc = "Copy git URL", mode = { "n", "x" } },

  -- Yank / clipboard
  { "<leader>y", group = "yank" },
  { "<leader>yh", "<cmd>YankyRingHistory<cr>", desc = "Yank history" },

  { "p", "<Plug>(YankyPutAfter)", desc = "Yanky put after", mode = { "n", "x" } },
  { "P", "<Plug>(YankyPutBefore)", desc = "Yanky put before", mode = { "n", "x" } },
  { "gp", "<Plug>(YankyGPutAfter)", desc = "Yanky gput after", mode = { "n", "x" } },
  { "gP", "<Plug>(YankyGPutBefore)", desc = "Yanky gput before", mode = { "n", "x" } },
  { "<C-n>", "<Plug>(YankyCycleForward)", desc = "Cycle yank forward", mode = "n" },
  { "<C-S-n>", "<Plug>(YankyCycleBackward)", desc = "Cycle yank backward", mode = "n" },
})
