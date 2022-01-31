vim.o.termguicolors = true
vim.opt.background = "dark"

-- This technically works even if we"re not using the their vim plugin.
-- https://github.com/chriskempson/base16-shell/tree/ce8e1e540367ea83cc3e01eec7b2a11783b3f9e1#base16-vim-users
if vim.fn.filereadable(vim.fn.expand("~/.vimrc_background")) then
	vim.api.nvim_exec([[ source ~/.vimrc_background ]], true)
end

-- https://github.com/hrsh7th/nvim-cmp/wiki/Menu-Appearance#how-to-add-visual-studio-code-dark-theme-colors-to-the-menu
vim.cmd([[
  " gray
  highlight! CmpItemAbbrDeprecated guibg=NONE gui=strikethrough guifg=#65737E

  " blue
  highlight! CmpItemAbbrMatch guibg=NONE guifg=#8FA1B3
  highlight! CmpItemAbbrMatchFuzzy guibg=NONE guifg=#8FA1B3

  " cyan
  highlight! CmpItemKindVariable guibg=NONE guifg=#96B5B4
  highlight! CmpItemKindInterface guibg=NONE guifg=#96B5B4
  highlight! CmpItemKindText guibg=NONE guifg=#96B5B4

  " magenta
  highlight! CmpItemKindFunction guibg=NONE guifg=#B48EAD
  highlight! CmpItemKindMethod guibg=NONE guifg=#B48EAD

  " front
  highlight! CmpItemKindKeyword guibg=NONE guifg=#DFE1E8
  highlight! CmpItemKindProperty guibg=NONE guifg=#DFE1E8
  highlight! CmpItemKindUnit guibg=NONE guifg=#DFE1E8
]])
