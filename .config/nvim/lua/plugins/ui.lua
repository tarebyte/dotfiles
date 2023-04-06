return {
	{
		"nvim-tree/nvim-web-devicons",
		lazy = true,
		config = function()
			local ok, _ = pcall(require, "base16-colorscheme")
			if not ok then
				return
			end

			require("nvim-web-devicons").setup({
				override = {
					["config.ru"] = {
						icon = "",
						color = vim.g.base16_gui08,
						cterm_color = "52",
						name = "ConfigRu",
					},
					erb = {
						icon = "",
						color = vim.g.base16_gui08,
						cterm_color = "52",
						name = "Erb",
					},
					fish = {
						icon = "",
						color = "#4d5a5e",
						cterm_color = "59",
						name = "Fish",
					},
					rake = {
						icon = "",
						color = vim.g.base16_gui08,
						cterm_color = "52",
						name = "Rake",
					},
					rb = {
						icon = "",
						color = vim.g.base16_gui08,
						cterm_color = "52",
						name = "Rb",
					},
				},
			})
		end,
	},
	{
		"nvim-lualine/lualine.nvim",
		opts = {
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
						color = "SLBranch",
						padding = { left = 2, right = 1 },
					},
				},
				lualine_c = {
					{
						"filename",
						symbols = { readonly = " " },
						path = 1,
						color = "SLFilename",
					},
					{
						"diff",
						colored = true,
						source = function()
							-- https://github.com/LunarVim/LunarVim/blob/41b3f63c37ce2f79defc22a2cbcd347281a808a5/lua/lvim/core/lualine/components.lua#L4-L13
							local gitsigns = vim.b.gitsigns_status_dict
							if gitsigns then
								return {
									added = gitsigns.added,
									modified = gitsigns.changed,
									removed = gitsigns.removed,
								}
							end
						end,
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
					{ "filetype", colored = false, color = "SLDiagnostics" },
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
					{
						function()
							local current_line = vim.fn.line(".")
							local total_lines = vim.fn.line("$")
							local chars = {
								"__",
								"▁▁",
								"▂▂",
								"▃▃",
								"▄▄",
								"▅▅",
								"▆▆",
								"▇▇",
								"██",
							}
							local line_ratio = current_line / total_lines
							local index = math.ceil(line_ratio * #chars)
							return chars[index]
						end,
						padding = { left = 0, right = 0 },
						color = "SLProgress",
						cond = nil,
					},
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
		},
	},
}
