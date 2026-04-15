# CLAUDE.md

Personal dotfiles. **chezmoi**-managed — source tree uses chezmoi's naming (`dot_Brewfile` → `~/.Brewfile`, `dot_config/...` → `~/.config/...`, `executable_` for +x, `private_` for 0600, `*.tmpl` for Go templates). Repo-management files (`README.md`, `CLAUDE.md`, `LICENSE`, `script/`) sit at the source root and are excluded from `$HOME` via `.chezmoiignore`. Per-OS gating also lives in `.chezmoiignore` (`.bash_aliases` ignored on non-Linux, `.Brewfile` ignored on non-Darwin, etc.) — no filename suffixes. Bootstrap steps are versioned `run_once_*` / `run_onchange_*` scripts at the source root that chezmoi hashes and re-runs when content changes.

## Commands

No tests, build, or linter. `script/doctor` is the closest to a test — run after any tooling change.

| Command | Purpose |
|---------|---------|
| `script/setup` | First-time entry point. Auto-run by Codespaces from the pre-cloned dir; run manually on a fresh Mac after `git clone`. Installs chezmoi if missing, then `chezmoi init --apply --source "$REPO"`. |
| `script/doctor` | Health check — core tools, shell, git, mise, Neovim, tmux/TPM. |
| `chezmoi apply` | Apply source tree to `$HOME`. Runs templates, copies files, fires `run_*` scripts. |
| `chezmoi diff` | Show per-file diff of source vs `$HOME`. Must be empty after a clean apply. |
| `chezmoi edit <target>` | Edit the source file for a given `$HOME` path (e.g. `chezmoi edit ~/.config/fish/config.fish`). |
| `brew bundle --global` | Re-sync after `dot_Brewfile` edit. The `run_onchange_after_10-brew-bundle.sh.tmpl` script re-runs this automatically on next `chezmoi apply` when the file changes. |
| `:Lazy sync` | Update/install Neovim plugins via lazy.nvim; commit `lazy-lock.json`. |

Git identity (name, email, GPG key ID, GitHub user) is NOT tracked. On `chezmoi init`, chezmoi prompts for the values (see `.chezmoi.toml.tmpl`) and writes them to `~/.config/chezmoi/chezmoi.toml` — per-machine, ungitted. `dot_config/git/config.tmpl` references them as `{{ .git.name }}` etc., so a forker gets prompted for their own values and nothing personal lives in the repo. In non-interactive contexts (Codespaces, devcontainers, CI) the prompts fall through to empty strings — no substitute values are fabricated. Codespaces is fine with this because the container injects its own `~/.gitconfig` with the authenticated identity, and the `[user]` / `[github]` / `gpgsign` blocks in `dot_config/git/config.tmpl` are all gated off when `.codespaces` is true (or `.git.signingkey` is empty).

`.chezmoi.toml.tmpl` also exposes `codespaces = {{ env "CODESPACES" | not | not }}` as a top-level data var, so every template can branch on `{{ if .codespaces }}` at template-render time instead of shelling out to `$CODESPACES` at runtime. `run_once_before_10-install-codespace-tools.sh.tmpl` gates its entire body on `{{ if .codespaces }}`, and `dot_config/git/config.tmpl` uses `.codespaces` to suppress `[user]` / `[github]`.

## Architecture

### Two-platform split

- **macOS** → Fish (`dot_config/fish/config.fish`) + Starship + Homebrew (`dot_Brewfile`). Bootstrap scripts: `run_once_before_10-install-homebrew.sh.tmpl`, `run_onchange_after_10-brew-bundle.sh.tmpl`, `run_once_after_20-set-fish-shell.sh.tmpl`, `run_onchange_after_30-fisher-update.sh.tmpl`. All gated on `{{ if eq .chezmoi.os "darwin" }}`.
- **Codespaces** → `dot_bash_aliases` (no Fish, no Starship). `run_once_before_10-install-codespace-tools.sh.tmpl` pulls nvim/rg/bat/fzf/lazygit/diff-so-fancy/tree-sitter via `gh release download` (arch-aware amd64/arm64). No Homebrew, no mise (Codespaces already provides language runtimes). Stays on bash; no `chsh`. This script is gated on `{{ if .codespaces }}`, not `{{ eq .chezmoi.os "linux" }}` — a hypothetical personal Linux machine would not get this bootstrap and would need its own setup path. (`dot_bash_aliases` is still gated on Linux in `.chezmoiignore`, which is effectively the same set today since Codespaces is the only Linux target.)

Shared: `dot_config/mise/config.toml.tmpl` (OS-branched), `EDITOR=nvim`, core aliases (`lg`, `gp`, `vi`, `vim`). Shell-level features usually need both `config.fish` and `dot_bash_aliases`.

Machine-local secrets on Codespaces come from user-defined Codespaces secrets (injected as env vars at container start). On Darwin, add them yourself — there is currently no machine-local env file in the tracked layout.

### Neovim — LazyVim base + manual LSP

Built on **LazyVim** (`lazy.nvim` under the hood). Mason is disabled — LSP servers are installed by mise/system and configured inline in `lua/plugins/lsp.lua` via `opts.servers`. No Mason, no `ensure_installed` for language servers.

Layout under `dot_config/nvim/`:
- `init.lua` — 3-line stub: sets leader and `require("config.lazy")`.
- `lua/config/lazy.lua` — bootstraps lazy.nvim and imports `lazyvim.plugins` + local `plugins/`. The enabled LazyVim extras live in `lazyvim.json` (managed by `:LazyExtras`), not in this file.
- `lazyvim.json` — tracks the enabled extras (`coding.mini-comment`, `coding.yanky`, `editor.aerial`, `editor.inc-rename`, `editor.navic`, `lang.go`, `ui.treesitter-context`, `util.chezmoi`, `util.mini-hipatterns`, `util.startuptime`) and news-read state. Commit changes after toggling extras.
- `lua/config/options.lua` — only the deltas from LazyVim defaults (`gdefault`, `cmdheight=0`, `listchars`, `updatetime`, `relativenumber=false`, `pumblend=0`).
- `lua/config/keymaps.lua` — only our custom keymaps on top of LazyVim's (`go`/`gO`, `<leader>O`, treesitter textobjects, projectionist alternate).
- `lua/config/autocmds.lua` — custom autocmds (CursorHold diagnostic float, gotmpl filetype + parser aliases).
- `lua/plugins/colorscheme.lua` — LazyVim `colorscheme` opt + catppuccin flavour, highlights, lualine palette integration.
- `lua/plugins/ui.lua` — lualine sections (single-letter mode, branch icon, no filetype icon, progress/location), snacks dashboard ASCII header + picker/notifier/statuscolumn/explorer, nvim-web-devicons (Ruby icon).
- `lua/plugins/disabled.lua` — single place for LazyVim plugins we turn off: `bufferline.nvim`, `mason.nvim`, `mason-lspconfig.nvim`, `neo-tree.nvim`.
- `lua/plugins/coding.lua` — blink.cmp Tab/S-Tab cycling + sources, disable for mini.surround.
- `lua/plugins/gitsigns.lua` — gitsigns `numhl` only (no current-line blame).
- `lua/plugins/noice.lua` — noice routes/presets.
- `lua/plugins/lsp.lua` — registers the Ruby servers (`ruby_lsp`, `vscode_sorbet`, `vscode_sorbet_rubocop`) via `opts.servers`, and sets `opts.diagnostics` (custom signs + focusless rounded float). `gopls` comes from the `lang.go` extra; `lua_ls` comes from LazyVim core (configured automatically, with `vim` globals + LuaJIT runtime handled by lazydev.nvim). Mason itself is disabled in `disabled.lua`.
- `lua/plugins/editing.lua` — vim-surround, vim-repeat, vim-eunuch, vim-projectionist, vim-rails, vim-better-whitespace, vim-dirvish + dirvish-git.
- `lua/plugins/treesitter.lua` — parser list (only additions beyond LazyVim core), treesitter-context, treesitter-textobjects, endwise.
- `ftplugin/`, `ftdetect/`, `after/` — standard.
- `lazy-lock.json` — pinned plugin versions; commit on update.

Conventions (intentional — don't "fix"):
- Leader: `,` (not space — set in `init.lua` before `require("config.lazy")`).
- `gdefault = true`, absolute line numbers, `cmdheight = 0`, `clipboard = unnamedplus`.
- Custom focusless diagnostic float on `CursorHold` (paired with `updatetime = 250`).
- Autocmds wrapped in a named `augroup` with `clear = true` so re-sourcing is idempotent.
- Theme: Catppuccin Mocha (matches tmux).
- File explorer: vim-dirvish (neo-tree disabled).
- Surround: vim-surround (mini.surround disabled).

Adding a plugin: create/edit a spec file under `lua/plugins/` returning a lazy.nvim spec table. Run `:Lazy sync`, commit `lazy-lock.json`.

Adding an LSP: add `<name> = { ... }` to `opts.servers` in `lua/plugins/lsp.lua` with the full `vim.lsp.Config` table inline. (No `lsp/<name>.lua` runtime files — everything lives in one place.)

Formatting: LazyVim's default `conform.nvim` wiring, untouched. Format-on-save runs through `LazyVim.format` (toggle with `<leader>uf` / `vim.g.autoformat`), Lua uses `stylua`, Go uses `goimports` + `gofumpt` (from the `lang.go` extra), and everything else falls back to the LSP formatter. No custom conform spec in `lua/plugins/` — adding one to set `format_on_save` will be stripped by LazyVim with a warning.

### Fish

`dot_config/fish/` = `config.fish`, `fish_plugins` (Fisher), `functions/` (one fn per file, filename must match function name). Non-obvious helpers: `gloan` (clones into `~/src/{owner}/{repo}`), `github_token` (1Password).

### Git / Tmux / Terminal

- **Git**: `dot_config/git/config.tmpl`. GPG signing on, `diff-so-fancy` pager, `pull.rebase`, default branch `main`. Aliases: `co` (fzf checkout), `cs` (signed commit), `up` (pull --rebase). `credential.helper = osxkeychain` and `gpg.program` paths are inside a `{{ if eq .chezmoi.os "darwin" }}` block.
- **Tmux**: prefix `Ctrl-f`, base index 1, vim copy-mode, Catppuccin Mocha, plugins via TPM (`prefix + I`).
- **iTerm2**: not tracked — changes too often. Don't edit here.

## Adding a file

1. Drop it into the source tree with chezmoi naming: `dot_` prefix for leading dots, `executable_` for +x, `private_` for 0600, `.tmpl` suffix for Go templates.
2. If it's per-OS, gate it in `.chezmoiignore` under the appropriate `{{ if ne .chezmoi.os "<os>" }}` block using its target path (no `dot_` prefix — `.chezmoiignore` uses target paths, not source paths).
3. Run `chezmoi diff` to preview, `chezmoi apply` to deploy.

## Dev focus

Ruby/Rails primary — Sorbet (`vscode_sorbet`, `vscode_sorbet_rubocop`), ruby-lsp, Rubocop (`dot_rubocop.yml`), vim-rails, `dot_pryrc`. Also Go (gopls + gofumpt + goimports via the `lang.go` LazyVim extra, binaries from mise), Lua (lua_ls, stylua), Node, Rust, Python, and .NET via mise. Because Mason is disabled, the `ensure_installed` entries inside LazyVim language extras are silent no-ops — any tool they want must be provided by mise or the system.
