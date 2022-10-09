local ok, devicons = pcall(require, "nvim-web-devicons")
if not ok then
	return
end

devicons.setup({
	override = {
		["config.ru"] = {
			icon = "",
			color = "#BF616A",
			cterm_color = "52",
			name = "ConfigRu",
		},
		erb = {
			icon = "",
			color = "#BF616A",
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
			color = "#BF616A",
			cterm_color = "52",
			name = "Rake",
		},
		rb = {
			icon = "",
			color = "#BF616A",
			cterm_color = "52",
			name = "Rb",
		},
	},
})
