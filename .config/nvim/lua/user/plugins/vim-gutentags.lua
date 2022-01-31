-- https://www.reddit.com/r/vim/comments/d77t6j/guide_how_to_setup_ctags_with_gutentags_properly/
-- https://github.com/bswinnerton/dotfiles/blob/fc72e15afa8634b14360356444808aa4d2229eb1/vim/vim.symlink/plugin/gutentags.vim#L1

vim.g["gutentags_cache_dir"] = vim.fn.expand("~/.cache/nvim/ctags/")
vim.g["gutentags_file_list_command"] = "rg --files"

vim.cmd([[
	command! -nargs=0 GutentagsClearCache call system('rm ' . g:gutentags_cache_dir . '/*')
]])

vim.g["gutentags_ctags_exclude"] = {
	"*.git",
	"build",
	"dist",
	"*sites/*/files/*",
	"bin",
	"node_modules",
	"bower_components",
	"cache",
	"docs",
	"example",
	"bundle",
	"vendor",
	"*.md",
	"*-lock.json",
	"*.lock",
	"*bundle*.js",
	"*build*.js",
	"*.json",
	"*.tmp",
	"*.cache",
	"tags*",
}
