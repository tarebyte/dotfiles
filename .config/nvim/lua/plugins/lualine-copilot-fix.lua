-- Remove once https://github.com/LazyVim/LazyVim/pull/5900 is released
return {
  {
    "zbirenbaum/copilot.lua",
    opts = function()
      require("copilot.api").status = require("copilot.status")
    end,
  },
}
