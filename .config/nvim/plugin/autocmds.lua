-- Paired with the install-time PackChanged in init.lua: that one runs TSSync
-- on first install, this one runs TSUpdate + TSSync on subsequent updates.
vim.api.nvim_create_autocmd("PackChanged", {
  callback = function(ev)
    local name, kind = ev.data.spec.name, ev.data.kind
    if name == "nvim-treesitter" and kind == "update" then
      if not ev.data.active then
        vim.cmd.packadd("nvim-treesitter")
      end
      vim.cmd("TSUpdate")
      vim.cmd("TSSync")
    end
  end,
})

-- Bundled with neovim: c, lua, markdown, markdown_inline, query, vim, vimdoc
local parsers = {
  "css",
  "diff",
  "dockerfile",
  "go",
  "gomod",
  "gosum",
  "gowork",
  "html",
  "javascript",
  "jsdoc",
  "json",
  "latex",
  "luadoc",
  "luap",
  "printf",
  "regex",
  "ruby",
  "scss",
  "sql",
  "toml",
  "tsx",
  "typescript",
  "yaml",
}

-- Lives here (not commands.lua) because it's coupled to the parsers list above.
vim.api.nvim_create_user_command("TSSync", function()
  local missing = vim.tbl_filter(function(lang)
    return not pcall(vim.treesitter.language.inspect, lang)
  end, parsers)

  if #missing == 0 then
    vim.notify("All parsers installed", vim.log.levels.INFO)
    return
  end

  vim.notify("Installing: " .. table.concat(missing, ", "), vim.log.levels.INFO)
  require("nvim-treesitter").install(missing)
end, { desc = "Install missing treesitter parsers" })

vim.api.nvim_create_autocmd("FileType", {
  pattern = parsers,
  callback = function()
    vim.treesitter.start()

    vim.wo[0][0].foldexpr = "v:lua.vim.treesitter.foldexpr()"
    vim.wo[0][0].foldmethod = "expr"

    vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
  end,
})

vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(ev)
    local client = vim.lsp.get_client_by_id(ev.data.client_id)
    if not client then
      return
    end

    require("which-key").add({
      buffer = ev.buf,
      { "K", vim.lsp.buf.hover, desc = "Hover" },
      { "gd", function() Snacks.picker.lsp_definitions() end, desc = "Goto definition" },
      { "gD", vim.lsp.buf.declaration, desc = "Goto declaration" },
      { "gr", function() Snacks.picker.lsp_references() end, desc = "References" },
      { "gI", function() Snacks.picker.lsp_implementations() end, desc = "Goto implementation" },
      { "gy", function() Snacks.picker.lsp_type_definitions() end, desc = "Goto type definition" },
      { "<C-k>", vim.lsp.buf.signature_help, desc = "Signature help", mode = { "n", "i" } },
      { "<leader>cr", vim.lsp.buf.rename, desc = "Rename symbol" },
      { "<leader>ca", vim.lsp.buf.code_action, desc = "Code action", mode = { "n", "x" } },
      { "<leader>cd", vim.diagnostic.open_float, desc = "Show diagnostic" },
      { "]d", function() vim.diagnostic.jump({ count = 1, float = true }) end, desc = "Next diagnostic" },
      { "[d", function() vim.diagnostic.jump({ count = -1, float = true }) end, desc = "Prev diagnostic" },
    })
  end,
})
