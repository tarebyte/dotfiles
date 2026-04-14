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
| `:lua vim.pack.update()` | Update Neovim plugins; commit `nvim-pack-lock.json`. |

Git identity (name, email, GPG key ID, GitHub user) is NOT tracked. On `chezmoi init`, chezmoi prompts for the values (see `.chezmoi.toml.tmpl`) and writes them to `~/.config/chezmoi/chezmoi.toml` — per-machine, ungitted. `dot_config/git/config.tmpl` references them as `{{ .git.name }}` etc., so a forker gets prompted for their own values and nothing personal lives in the repo.

## Architecture

### Two-platform split

- **macOS** → Fish (`dot_config/fish/config.fish`) + Starship + Homebrew (`dot_Brewfile`). Bootstrap scripts: `run_once_before_10-install-homebrew.sh.tmpl`, `run_onchange_after_10-brew-bundle.sh.tmpl`, `run_once_after_20-set-fish-shell.sh.tmpl`, `run_onchange_after_30-fisher-update.sh.tmpl`. All gated on `{{ if eq .chezmoi.os "darwin" }}`.
- **Linux / Codespaces** → `dot_bash_aliases` (no Fish, no Starship). `run_once_before_10-install-linux-tools.sh.tmpl` pulls nvim/rg/bat/fzf/lazygit/diff-so-fancy/mise/tree-sitter via `gh release download` (arch-aware amd64/arm64). No Homebrew. Stays on zsh; no `chsh`.

Shared: `dot_config/mise/config.toml.tmpl` (OS-branched), `EDITOR=nvim`, core aliases (`lg`, `gp`, `vi`, `vim`). Shell-level features usually need both `config.fish` and `dot_bash_aliases`.

Machine-local secrets on Codespaces come from user-defined Codespaces secrets (injected as env vars at container start). On Darwin, add them yourself — there is currently no machine-local env file in the tracked layout.

### Neovim — native, no framework

**No LazyVim, lazy.nvim, or Mason.** `vim.pack.add()` only. Read `dot_config/nvim/init.lua` first for anything plugin-related — it is the full plugin manifest and config.

Layout:
- `init.lua` — plugins declared via `vim.pack.add()` up top, configured inline below.
- `plugin/` — auto-sourced after `init.lua` (`:h load-plugins` step 11): `options.lua`, `keymaps.lua`, `autocmds.lua`, `commands.lua`. Safe to `require()` plugins here.
- `lsp/<server>.lua` — per-server configs loaded via `vim.lsp.enable({...})` from `init.lua`. Add a server by dropping a file and appending its name to the enable list.
- `ftplugin/`, `ftdetect/`, `after/` — standard.
- `nvim-pack-lock.json` — pinned by `vim.pack`; commit on update.

Conventions (intentional — don't "fix"):
- Leader: `,`
- `gdefault = true`, absolute line numbers.
- `cmdheight = 0`, `laststatus = 3`, `clipboard = unnamedplus`.
- Custom focusless diagnostic float on `CursorHold`.
- Autocmds wrapped in a named `augroup` with `clear = true` so re-sourcing is idempotent. Follow this pattern for new ones.
- Theme: Catppuccin Mocha (matches tmux).

Adding a plugin: `gh("owner/repo")` in `vim.pack.add({...})`, then `require(...).setup(...)` below. Run `:lua vim.pack.update()`, commit the lock.

Formatting via `conform.nvim` — `format_on_save` with LSP fallback. Go: `goimports` + `gofumpt`. Lua: `stylua`.

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

Ruby/Rails primary — Sorbet (`vscode_sorbet`), ruby-lsp, Rubocop (`dot_rubocop.yml`), vim-rails, `dot_pryrc`. Also Go (gopls, gofumpt, goimports), Lua (lua_ls, stylua), Node, Rust, Python, .NET via mise.
