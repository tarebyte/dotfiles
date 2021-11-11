require('lualine').setup {
	extensions = { 'fugitive', 'fzf' },
	options = {
		component_separators = {'', ''},
		icons_enabled = false,
		section_separators = {'', ''},
		theme = 'base16_ocean'
	},
	sections = {
		lualine_c = {
			{ 'filename', path = 1 }
		}
	},
	inactive_sections = {
		lualine_c = {
			{ 'filename', path = 1 }
		}
	}
}
