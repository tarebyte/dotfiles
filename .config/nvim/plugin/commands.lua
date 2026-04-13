-- Discovers LSP configs via the Neovim 0.11+ convention: any `lsp/<name>.lua`
-- on the runtime path is a valid argument to `vim.lsp.enable`.
local function complete_config(arg)
  return vim
    .iter(vim.api.nvim_get_runtime_file(("lsp/%s*.lua"):format(arg), true))
    :map(function(path)
      return (path:match("([^/]+)%.lua$"))
    end)
    :totable()
end

local function complete_client(arg)
  return vim
    .iter(vim.lsp.get_clients())
    :map(function(c)
      return c.name
    end)
    :filter(function(name)
      return name:sub(1, #arg) == arg
    end)
    :totable()
end

vim.api.nvim_create_user_command("LspInfo", "checkhealth vim.lsp", {
  desc = "LSP health",
})

vim.api.nvim_create_user_command("LspLog", function()
  vim.cmd.tabnew(vim.lsp.log.get_filename())
end, { desc = "Open the LSP client log in a new tab" })

vim.api.nvim_create_user_command("LspStart", function(info)
  vim.cmd("lsp enable " .. table.concat(info.fargs, " "))
end, { nargs = "*", complete = complete_config, desc = "Enable LSP config(s)" })

vim.api.nvim_create_user_command("LspStop", function(info)
  vim.cmd("lsp stop " .. table.concat(info.fargs, " "))
end, { nargs = "*", complete = complete_client, desc = "Stop LSP client(s)" })

vim.api.nvim_create_user_command("LspRestart", function(info)
  vim.cmd("lsp restart " .. table.concat(info.fargs, " "))
end, { nargs = "*", complete = complete_client, desc = "Restart LSP client(s)" })
