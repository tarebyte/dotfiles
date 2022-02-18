local colors = require("user.utils.colors")
if not colors.loaded then
	return
end

vim.cmd("highlight ExtraWhitespace ctermbg=red ctermfg=white guibg=${colors.base08} guifg=${colors.base05}")
