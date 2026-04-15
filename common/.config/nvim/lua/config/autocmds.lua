-- LazyVim sets its own autocmds first; this file adds ours.

local ts = vim.api.nvim_create_augroup("treesitter_custom", { clear = true })
local diag = vim.api.nvim_create_augroup("diagnostics", { clear = true })

-- Register the gotmpl parser under per-target aliases so each compound
-- filetype resolves injection queries from its own directory
-- (after/queries/gotmpl_<lang>/injections.scm).
local gotmpl_aliases = { "gotmpl_bash", "gotmpl_html" }
local gotmpl_so = vim.api.nvim_get_runtime_file("parser/gotmpl.so", false)[1]
if gotmpl_so then
  for _, alias in ipairs(gotmpl_aliases) do
    pcall(vim.treesitter.language.add, alias, { path = gotmpl_so, symbol_name = "gotmpl" })
  end
end

vim.api.nvim_create_autocmd("FileType", {
  group = ts,
  pattern = gotmpl_aliases,
  callback = function()
    vim.treesitter.start()
    vim.wo[0][0].foldexpr = "v:lua.vim.treesitter.foldexpr()"
    vim.wo[0][0].foldmethod = "expr"
  end,
})

vim.filetype.add({
  pattern = {
    [".*%.sh%.g?o?tmpl$"] = "gotmpl_bash",
    [".*%.bash%.g?o?tmpl$"] = "gotmpl_bash",
    [".*%.html%.g?o?tmpl$"] = "gotmpl_html",
    [".*%.g?o?tmpl$"] = "gotmpl_html",
  },
})

-- Diagnostic float on hover; paired with updatetime = 250 in options.lua.
vim.api.nvim_create_autocmd("CursorHold", {
  group = diag,
  callback = function()
    vim.diagnostic.open_float(nil, { focus = false, scope = "cursor" })
  end,
})
