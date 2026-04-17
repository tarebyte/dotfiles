-- Loaded by LazyVim after its own defaults. Only list deviations.

-- LazyVim's own options.lua sets mapleader = " ", which would override
-- the value we set in init.lua. Set it again here so it sticks.
vim.g.mapleader = ","

local opt = vim.opt

opt.gdefault = true
opt.cmdheight = 0
opt.listchars = "tab:> ,trail:-,extends:>,precedes:<,nbsp:+"
opt.updatetime = 250
opt.relativenumber = false
opt.pumblend = 0

vim.o.mousemoveevent = true
