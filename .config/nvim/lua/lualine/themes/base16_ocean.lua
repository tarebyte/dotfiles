local ok, _ = pcall(require, "base16-colorscheme")
if not ok then
  return {}
end

return {
  normal = {
    a = { fg = vim.g.base16_gui01, bg = vim.g.base16_gui0B, gui = "bold" },
    b = { fg = vim.g.base16_gui06, bg = vim.g.base16_gui02 },
    c = { fg = vim.g.base16_gui09, bg = vim.g.base16_gui01 },
  },
  insert = {
    a = { fg = vim.g.base16_gui01, bg = vim.g.base16_gui0D, gui = "bold" },
    b = { fg = vim.g.base16_gui06, bg = vim.g.base16_gui02 },
    c = { fg = vim.g.base16_gui09, bg = vim.g.base16_gui01 },
  },
  replace = {
    a = { fg = vim.g.base16_gui01, bg = vim.g.base16_gui08, gui = "bold" },
    b = { fg = vim.g.base16_gui06, bg = vim.g.base16_gui02 },
    c = { fg = vim.g.base16_gui09, bg = vim.g.base16_gui01 },
  },
  visual = {
    a = { fg = vim.g.base16_gui01, bg = vim.g.base16_gui0E, gui = "bold" },
    b = { fg = vim.g.base16_gui06, bg = vim.g.base16_gui02 },
    c = { fg = vim.g.base16_gui09, bg = vim.g.base16_gui01 },
  },
  command = {
    a = { fg = vim.g.base16_gui01, bg = vim.g.base16_gui0C, gui = "bold" },
    b = { fg = vim.g.base16_gui06, bg = vim.g.base16_gui02 },
    c = { fg = vim.g.base16_gui09, bg = vim.g.base16_gui01 },
  },
  inactive = {
    a = { fg = vim.g.base16_gui05, bg = vim.g.base16_gui01, gui = "bold" },
    b = { fg = vim.g.base16_gui05, bg = vim.g.base16_gui01 },
    c = { fg = vim.g.base16_gui05, bg = vim.g.base16_gui01 },
  },
}
