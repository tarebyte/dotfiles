#!/bin/sh
# Claude Code status line in the Dreambase Flat layout (statuslin.es/c/dreambase-flat-f5cbd3ff),
# recolored with Catppuccin: Mocha when macOS is dark, Latte when light. No cost, no git status.
# Reads Claude Code session JSON on stdin.
if defaults read -g AppleInterfaceStyle >/dev/null 2>&1; then dark=true; else dark=false; fi
input=$(cat)
# Codespace bound to this worktree by gh csd, if any, and what gh csd is
# doing with it (creating…, setting up…, dotfiles…) while that runs.
cwd=$(printf '%s' "$input" | jq -r '.workspace.current_dir // .cwd // empty')
cs=""
phase=""
if gitdir=$(git -C "${cwd:-.}" rev-parse --absolute-git-dir 2>/dev/null); then
	cs=$(cat "$gitdir/cs-dev-codespace" 2>/dev/null)
	phase=$(cat "$gitdir/cs-dev-status" 2>/dev/null)
fi
printf '%s' "$input" | exec jq -r --argjson dark "$dark" --arg cs "$cs" --arg phase "$phase" '
  def hex(h): h | [.[0:2], .[2:4], .[4:6]] | map(explode | map(if . > 96 then . - 87 else . - 48 end) | .[0] * 16 + .[1]) | "\u001b[38;2;\(.[0]);\(.[1]);\(.[2])m";
  def bghex(h): hex(h) | sub("38;2"; "48;2");
  def tokens: if . >= 1000000 then (. / 100000 | floor) as $t | "\($t / 10 | floor).\($t % 10)M"
    elif . >= 1000 then (. / 100 | floor) as $t | "\($t / 10 | floor).\($t % 10)K"
    else tostring end;
  def duration: (. / 1000 | floor) as $s
    | if $s >= 3600 then "\($s / 3600 | floor)h \($s % 3600 / 60 | floor)m"
      else "\($s / 60 | floor)m" end;

  (if $dark then
    {green: "a6e3a1", teal: "94e2d5", yellow: "f9e2af", peach: "fab387", red: "f38ba8",
     blue: "89b4fa", mauve: "cba6f7", text: "9399b2", sep: "6c7086", empty: "585b70", base: "1e1e2e"}
  else
    {green: "40a02b", teal: "179299", yellow: "df8e1d", peach: "fe640b", red: "d20f39",
     blue: "1e66f5", mauve: "8839ef", text: "7c7f93", sep: "9ca0b0", empty: "acb0be", base: "eff1f5"}
  end | map_values(hex(.))) as $c
  | "\u001b[0m" as $r
  | " \($c.sep)│\($r) " as $section

  # Context: 22-cell bar with eighth-block partials, percentage, window size.
  | (.context_window.used_percentage // 0) as $pct
  | (.context_window.context_window_size // 200000) as $size
  | (if $pct >= 95 then $c.red elif $pct >= 85 then $c.peach
     elif $pct >= 70 then $c.yellow elif $pct >= 50 then $c.teal
     else $c.green end) as $level
  | ([$pct, 100] | min) * 22 / 100 as $cells
  | ($cells | floor) as $full
  | (($cells - $full) * 8 | floor) as $eighths
  | (if $full < 22 and $eighths > 0 then " ▏▎▍▌▋▊▉"[$eighths:$eighths + 1] else "" end) as $partial
  | (22 - $full - ($partial | length)) as $blank
  | "\($level)\("█" * $full)\($partial)\($c.empty)\("░" * $blank)\($r)"
    + " \($level)\($pct | floor)%\($r)"
    + " \($c.sep)of\($r) \($c.peach)\(if $size >= 1000000 then "\($size / 1000000 | floor)M" else "\($size / 1000 | floor)K" end)\($r)"
    as $context

  # Stats: tokens in and out, session duration, lines Claude changed.
  | (.cost.total_lines_added // 0) as $added
  | (.cost.total_lines_removed // 0) as $removed
  | "\($c.blue)↓\($r) \($c.text)\(.context_window.total_input_tokens // 0 | tokens)\($r)"
    + "  \($c.mauve)↑\($r) \($c.text)\(.context_window.total_output_tokens // 0 | tokens)\($r)"
    + " \($c.sep)│\($r) \($c.text)⏱ \(.cost.total_duration_ms // 0 | duration)\($r)"
    + (if $added + $removed > 0 then " \($c.sep)│\($r) \($c.green)+\($added)\($c.sep)/\($c.red)-\($removed)\($r)" else "" end)
    as $stats

  # Model: diamond colored by family, name, thinking level, vim badge.
  | (.model.display_name // .model.id // "?") as $model
  | ($model | ascii_downcase) as $m
  | (if ($m | test("opus")) then $c.peach elif ($m | test("sonnet")) then $c.blue
     elif ($m | test("haiku")) then $c.green else $c.text end) as $diamond
  | "\($diamond)◆\($r) \($c.peach)\($model)\($r)"
    + (if .effort.level then " \($c.sep)·\($r) \($c.text)\(.effort.level)\($r)" else "" end)
    + ({"NORMAL": " N ", "INSERT": " I "}[.vim.mode // ""] // "" | if . != "" then " \(bghex($dark | if . then "fab387" else "fe640b" end))\($c.base)\(.)\($r)" else "" end)
    as $repo

  # Context on the left, everything else pushed to the right edge. Claude Code sets COLUMNS to the terminal width.
  # ponytail: 4-column margin for the row padding of Claude Code; raise it if the line wraps.
  | def visible: gsub("\u001b\\[[0-9;]*m"; "") | length;
  # Codespace: its name, then the gh csd phase in yellow while gh csd works.
  (if $cs == "" and $phase == "" then ""
   else "\($c.teal)☁\($r)"
     + (if $cs != "" then " \($c.text)\($cs)\($r)" else "" end)
     + (if $phase != "" then (if $cs != "" then " \($c.sep)·\($r)" else "" end) + " \($c.yellow)\($phase)\($r)" else "" end)
   end) as $codespace
  | ([$codespace, $stats, $repo] | map(select(. != "")) | join($section)) as $right
  | (($ENV.COLUMNS // "0" | tonumber) - ($context | visible) - ($right | visible) - 4) as $gap
  | if $gap >= 2 then $context + " " * $gap + $right else [$context, $right] | join($section) end
'
