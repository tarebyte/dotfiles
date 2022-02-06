local ok, devicons = pcall(require, "nvim-web-devicons")
if not ok then
	return
end

devicons.setup({
	override = {
		fish = {
			icon = "",
			color = "#4d5a5e",
			cterm_color = "59",
			name = "Fish",
		},
		rb = {
			icon = " ",
			color = "#701516",
			cterm_color = "52",
			name = "Rb",
		},
	},
})
