local status_ok, lualine = pcall(require, "lualine")
if not status_ok then
	return
end

-- https://github.com/LunarVim/LunarVim/blob/41b3f63c37ce2f79defc22a2cbcd347281a808a5/lua/lvim/core/lualine/components.lua#L4-L13
local function diff_source()
	local gitsigns = vim.b.gitsigns_status_dict
	if gitsigns then
		return {
			added = gitsigns.added,
			modified = gitsigns.changed,
			removed = gitsigns.removed,
		}
	end
end

-- https://github.com/LunarVim/LunarVim/blob/52b74557415eb757ad4b7481b0aec8a3f98dd58d/lua/lvim/core/lualine/components.lua#L141-L153
local scrollbar = {
	function()
		local current_line = vim.fn.line(".")
		local total_lines = vim.fn.line("$")
		local chars = { "__", "▁▁", "▂▂", "▃▃", "▄▄", "▅▅", "▆▆", "▇▇", "██" }
		local line_ratio = current_line / total_lines
		local index = math.ceil(line_ratio * #chars)
		return chars[index]
	end,
	padding = { left = 0, right = 0 },
	color = { fg = vim.g.base16_gui0A, bg = vim.g.base16_gui01 },
	cond = nil,
}

lualine.setup({
	options = {
		icons_enabled = true,
		theme = "base16_ocean",
		component_separators = { left = "", right = "" },
		section_separators = { left = "", right = "" },
	},
	sections = {
		lualine_a = {
			{
				"mode",
				fmt = function(str)
					return str:sub(1, 1)
				end,
				padding = 1,
			},
		},
		lualine_b = {
			{
				"branch",
				"b:gitsigns_head",
				icon = "",
				color = { fg = vim.g.base16_gui04, bg = vim.g.base16_gui01, gui = "bold" },
				padding = { left = 2, right = 1 },
			},
		},
		lualine_c = {
			{
				"filename",
				symbols = { readonly = " " },
				path = 1,
				color = { fg = vim.g.base16_gui04, bg = vim.g.base16_gui01 },
			},
			{
				"diff",
				colored = true,
				source = diff_source(),
				symbols = { added = " ", modified = " ", removed = " " },
			},
		},
		lualine_x = {
			{
				"diagnostics",
				sources = { "nvim_lsp", "nvim_diagnostic" },
				colored = true,
				symbols = { error = " ", warn = " ", hint = " ", info = " " },
			},
			{ "filetype", colored = false, color = { fg = vim.g.base16_gui04 } },
		},
		lualine_y = {
			{
				"location",
				fmt = function()
					return "Ln %l, Col %-2v"
				end,
			},
		},
		lualine_z = {
			scrollbar,
		},
	},
	inactive_sections = {
		lualine_c = {
			{ "filename", path = 1 },
		},
		lualine_x = {
			{
				"location",
				fmt = function()
					return "Ln %l,Col %-2v"
				end,
			},
		},
	},
	extensions = { "fzf" },
})
