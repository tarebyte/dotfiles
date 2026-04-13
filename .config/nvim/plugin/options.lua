-- Use :help '<option>' for documentation
vim.cmd.set("number") -- show line numbers
vim.o.clipboard = "unnamedplus" -- use system clipboard for all yanks/pastes
vim.o.foldlevelstart = 99 -- all folds open by default
vim.o.gdefault = true -- :s replaces all matches by default; the `g` flag now toggles to single-match

vim.o.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+" -- characters for invisible whitespace
vim.o.laststatus = 3 -- always and ONLY the last window
vim.o.cmdheight = 0 -- hide the cmdline when not in use
vim.o.splitbelow = true -- open horizontal splits below current window
vim.o.splitright = true -- open vertical splits right of current window
vim.o.updatetime = 250 -- ms before CursorHold fires (default 4000); paired with the diagnostic-float autocmd at the bottom of this file


local icons = {
  [vim.diagnostic.severity.ERROR] = "",
  [vim.diagnostic.severity.WARN] = "",
  [vim.diagnostic.severity.INFO] = "",
  [vim.diagnostic.severity.HINT] = "",
}

vim.diagnostic.config({
  signs = {
    text = {
      [vim.diagnostic.severity.ERROR] = "▎",
      [vim.diagnostic.severity.WARN] = "▎",
      [vim.diagnostic.severity.INFO] = "▎",
      [vim.diagnostic.severity.HINT] = "▎",
    },
  },
  status = {
    format = function(counts)
      local highlights = {
        [vim.diagnostic.severity.ERROR] = "DiagnosticError",
        [vim.diagnostic.severity.WARN] = "DiagnosticWarn",
        [vim.diagnostic.severity.INFO] = "DiagnosticInfo",
        [vim.diagnostic.severity.HINT] = "DiagnosticHint",
      }
      local parts = {}
      for severity, count in pairs(counts) do
        local hl = highlights[severity]
        table.insert(parts, "%#" .. hl .. "#" .. icons[severity] .. " " .. count .. "%*")
      end
      return table.concat(parts, " ")
    end,
  },
  float = {
    border = "rounded",
    source = "if_many",
    focusable = false,
    header = "",
    prefix = "",
    wrap = true,
    max_width = 80,
  },
})

vim.api.nvim_create_autocmd("CursorHold", {
  callback = function()
    vim.diagnostic.open_float(nil, { focus = false, scope = "cursor" })
  end,
})
