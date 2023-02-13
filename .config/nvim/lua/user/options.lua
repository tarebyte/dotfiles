-- make backspace work in insert mode
vim.o.backspace = "indent,eol,start"

-- use system clipboard
vim.o.clipboard = "unnamed"

-- set temporary directory (don't litter local dir with swp/tmp files)
vim.o.directory = "/tmp/" -- TODO: Maybe set XDG_DATA_HOME on Mac.

-- when lines are cropped at the screen bottom, show as much as possible
vim.o.display = "lastline"

-- assume the /g flag on substitutions to replace all matches in a line
vim.o.gdefault = true

-- don't abandon buffers when unloading
vim.o.hidden = true

-- searching is case insensitive when all lowercase
vim.o.ignorecase = true
vim.o.smartcase = true

-- highlight trailing whitespace
vim.o.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+"
vim.o.list = true

-- enable line numbers, and don't make them any wider than necessary
vim.o.number = true
vim.o.numberwidth = 2

-- scroll the winder when we get near the edge
vim.o.scrolloff = 4
vim.o.sidescrolloff = 10

-- flip the default split directions to the sane ones
vim.o.splitright = true
vim.o.splitbelow = true

-- use 2 spaces for tabs
vim.o.expandtab = true
vim.o.tabstop = 2
vim.o.softtabstop = 2
vim.o.shiftwidth = 2

-- don't beep for errors
vim.o.visualbell = true

-- use tab-complete to see a list of possiblities when entering commands
vim.o.wildmode = "list:longest,full"

-- don't wrap long lines
vim.o.wrap = false
