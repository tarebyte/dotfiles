vim.o.termguicolors = true
vim.opt.background = "dark"

-- This technically works even if we"re not using the their vim plugin.
-- https://github.com/chriskempson/base16-shell/tree/ce8e1e540367ea83cc3e01eec7b2a11783b3f9e1#base16-vim-users
if vim.fn.filereadable(vim.fn.expand("~/.vimrc_background")) then
	vim.api.nvim_exec([[ source ~/.vimrc_background ]], true)
end

local colors = require("user.utils.colors")

-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-dark-theme-colors-to-the-menu
vim.cmd([[
  " gray
  highlight! CmpItemAbbrDeprecated guibg=NONE gui=strikethrough guifg=${colors.base03}

  " blue
  highlight! CmpItemAbbrMatch guibg=NONE guifg=${colors.base0D}
  highlight! CmpItemAbbrMatchFuzzy guibg=NONE guifg=${colors.base0D}

  " cyan
  highlight! CmpItemKindVariable guibg=NONE guifg=${colors.base0C}
  highlight! CmpItemKindInterface guibg=NONE guifg=${colors.base0C}
  highlight! CmpItemKindText guibg=NONE guifg=${colors.base0C}

  " magenta
  highlight! CmpItemKindFunction guibg=NONE guifg=${colors.base0E}
  highlight! CmpItemKindMethod guibg=NONE guifg=${colors.base0E}

  " front
  highlight! CmpItemKindKeyword guibg=NONE guifg=${colors.base06}
  highlight! CmpItemKindProperty guibg=NONE guifg=${colors.base06}
  highlight! CmpItemKindUnit guibg=NONE guifg=${colors.base06}
]])
