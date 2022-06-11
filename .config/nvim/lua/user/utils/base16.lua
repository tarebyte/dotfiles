local M = {}

-- Public: Get the background setting for the set theme.
--
-- Returns a String or nil.
M.background = function()
	return os.getenv("base16_fish_shell_background")
end

-- Public: Get the base16 theme as set by the FabioAntunes/base16-fish-shell
-- fisher plugin.
--
-- Example:
--
--   > get_base16_theme()
--   => "base16-ocean"
--
-- Returns a String or nil.
M.theme = function()
	local file = io.open(os.getenv("HOME") .. "/.config/fish/fish_variables")

	if file ~= nil then
		local theme = ""

		for line in file:lines() do
			if string.match(line, "SETUVAR base16_fish_theme") then
				line = string.gsub(line, "%\\x2d", "-")

				local start, stop = string.find(line, "%:.*$")
				theme = string.sub(line, (start + 1), stop)
			end
		end

		file:close()

		if theme ~= nil then
			return string.format("base16-%s", theme)
		end
	end

	return nil
end

return M
