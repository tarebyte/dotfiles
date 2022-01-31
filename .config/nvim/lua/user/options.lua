-- make backspace work in insert mode
vim.opt.backspace = "indent,eol,start"

-- use system clipboard
vim.opt.clipboard = "unnamed"

-- set temporary directory (don't litter local dir with swp/tmp files)
vim.opt.directory = "/tmp/" -- TODO: Maybe set XDG_DATA_HOME on Mac.

-- when lines are cropped at the screen bottom, show as much as possible
vim.opt.display = "lastline"

-- assume the /g flag on substitutions to replace all matches in a line
vim.opt.gdefault = true

-- don't abandon buffers when unloading
vim.opt.hidden = true

-- searching is case insensitive when all lowercase
vim.opt.ignorecase = true
vim.opt.smartcase = true

-- highlight trailing whitespace
vim.opt.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+"
vim.opt.list = true

-- enable line numbers, and don't make them any wider than necessary
vim.opt.number = true
vim.opt.numberwidth = 2

-- scroll the winder when we get near the edge
vim.opt.scrolloff = 4
vim.opt.sidescrolloff = 10

-- flip the default split directions to the sane ones
vim.opt.splitright = true
vim.opt.splitbelow = true

-- use 2 spaces for tabs
vim.opt.expandtab = true
vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2

-- don't beep for errors
vim.opt.visualbell = true

-- use tab-complete to see a list of possiblities when entering commands
vim.opt.wildmode = "list:longest,full"

-- don't wrap long lines
vim.opt.wrap = false
