local M = {}

-- Public: Get the background setting for the set theme.
--
-- Returns a String (default "dark).
M.background = function()
  return os.getenv("base16_fish_shell_background") or "dark"
end

-- Public: Get the base16 theme as set by the FabioAntunes/base16-fish-shell
-- fisher plugin.
--
-- Example:
--
--   > get_base16_theme()
--   => "base16-ocean"
--
-- Returns a String (default "base16-ocean").
M.theme = function()
  local file, _ = io.open(os.getenv("HOME") .. "/.config/fish/fish_variables")

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

  return "base16-ocean"
end

return M
