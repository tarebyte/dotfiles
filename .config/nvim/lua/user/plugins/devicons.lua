local ok, devicons = pcall(require, "nvim-web-devicons")
if not ok then
	return
end

local base16_ok, base16 = pcall(require, "base16-colorscheme")
if not base16_ok then
	return
end

devicons.setup({
	override = {
		["config.ru"] = {
			icon = "",
			color = base16.colors.base08,
			cterm_color = "52",
			name = "ConfigRu",
		},
		erb = {
			icon = "",
			color = base16.colors.base08,
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
			color = base16.colors.base08,
			cterm_color = "52",
			name = "Rake",
		},
		rb = {
			icon = "",
			color = base16.colors.base08,
			cterm_color = "52",
			name = "Rb",
		},
	},
})
