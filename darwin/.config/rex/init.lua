-- Rex config, migrated from tmux and zellij. iTerm2 had no key bindings.

-- tmux: ~/.tmux.conf:18 (prefix ctrl+f)
rex.bind("ctrl+f>ctrl+f", "pane.send_key", { key = "ctrl+f" })

-- zellij: ~/.config/zellij/config.kdl (clear-defaults=true)
rex.action{
  name  = "then_normal",
  title = "Run an action and return to normal mode",
  args  = { action = "string", args = "object?" },
  run   = function(ctx, args)
    rex.client.queue(args.action, args.args or {})
    rex.client.queue("client.mode.exit_all")
  end,
}

local MODES = { "pane", "tab", "resize", "move", "tmux" }
local DIRS = { left = "left", down = "down", up = "up", right = "right",
               h = "left", j = "down", k = "up", l = "right" }

-- locked (3)
rex.bind("locked/ctrl+g", "client.mode.exit_all")

-- shared_except "locked" (136-178): normal mode plus every migrated mode
local switch = { ["ctrl+h"] = "move", ["ctrl+b"] = "tmux", ["ctrl+t"] = "tab",
                 ["ctrl+p"] = "pane", ["ctrl+n"] = "resize" }
for _, m in ipairs({ "", "pane", "tab", "resize", "move", "tmux" }) do
  local p = m == "" and "" or m .. "/"
  for key, d in pairs(DIRS) do
    rex.bind(p .. "alt+" .. key, "pane.focus", { direction = d })
  end
  rex.bind(p .. "alt+i", "client.tab.move", { direction = "backward" })
  rex.bind(p .. "alt+o", "client.tab.move", { direction = "forward" })
  rex.bind(p .. "alt+n", "pane.split", { direction = "auto" })
  rex.bind(p .. "ctrl+g", "client.mode.enter", { name = "locked" })
  for key, target in pairs(switch) do
    if target ~= m then
      rex.bind(p .. key, "client.mode.enter", { name = target })
    end
  end
end

-- enter (181), esc (184): back to normal in every migrated mode
for _, m in ipairs(MODES) do
  rex.bind(m .. "/enter", "client.mode.exit_all")
  rex.bind(m .. "/esc", "client.mode.exit_all")
end

-- pane (5-25), x (187)
for key, d in pairs(DIRS) do
  rex.bind("pane/" .. key, "pane.focus", { direction = d })
end
rex.bind("pane/c", "then_normal", { action = "pane.rename" })
rex.bind("pane/d", "then_normal", { action = "pane.split", args = { direction = "down" } })
rex.bind("pane/f", "then_normal", { action = "pane.zoom" })
rex.bind("pane/n", "then_normal", { action = "pane.split", args = { direction = "auto" } })
rex.bind("pane/p", "pane.focus_next")
rex.bind("pane/ctrl+p", "client.mode.exit_all")
rex.bind("pane/r", "then_normal", { action = "pane.split", args = { direction = "right" } })
rex.bind("pane/x", "then_normal", { action = "pane.close" })

-- tab (27-53)
for key, a in pairs({ left = "previous", up = "previous", h = "previous", k = "previous",
                      down = "next", right = "next", j = "next", l = "next" }) do
  rex.bind("tab/" .. key, "client.tab." .. a)
end
for i = 1, 9 do
  rex.bind("tab/" .. i, "then_normal", { action = "client.tab.goto", args = { index = i } })
end
rex.bind("tab/b", "then_normal", { action = "pane.move_to_new_tab" })
rex.bind("tab/n", "then_normal", { action = "client.tab.new" })
rex.bind("tab/r", "then_normal", { action = "client.tab.rename" })
rex.bind("tab/ctrl+t", "client.mode.exit_all")
rex.bind("tab/x", "then_normal", { action = "client.tab.close" })

-- resize (55-71)
for key, d in pairs(DIRS) do
  rex.bind("resize/" .. key, "pane.resize", { direction = d })
end
rex.bind("resize/ctrl+n", "client.mode.exit_all")

-- move (73-85)
for key, d in pairs(DIRS) do
  rex.bind("move/" .. key, "pane.move", { direction = d })
end
rex.bind("move/ctrl+h", "client.mode.exit_all")

-- tmux (224-243), x (187)
for key, d in pairs(DIRS) do
  rex.bind("tmux/" .. key, "then_normal", { action = "pane.focus", args = { direction = d } })
end
rex.bind("tmux/shift+'", "then_normal", { action = "pane.split", args = { direction = "down" } })
rex.bind("tmux/shift+5", "then_normal", { action = "pane.split", args = { direction = "right" } })
rex.bind("tmux/,", "then_normal", { action = "client.tab.rename" })
rex.bind("tmux/ctrl+b", "then_normal", { action = "pane.send_key", args = { key = "ctrl+b" } })
rex.bind("tmux/c", "then_normal", { action = "client.tab.new" })
rex.bind("tmux/n", "then_normal", { action = "client.tab.next" })
rex.bind("tmux/o", "pane.focus_next")
rex.bind("tmux/p", "then_normal", { action = "client.tab.previous" })
rex.bind("tmux/x", "then_normal", { action = "pane.close" })
rex.bind("tmux/z", "then_normal", { action = "pane.zoom" })

-- zellij stays in these modes until told to leave
for _, m in ipairs({ "locked", "pane", "tab", "resize", "move", "tmux" }) do
  rex.mode(m, { exclusive = true })
end
