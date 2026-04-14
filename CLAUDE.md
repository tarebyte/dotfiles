# CLAUDE.md

Personal dotfiles. **YADM**-managed — repo layout = `$HOME` layout (`.config/...`, `.tmux.conf`, `.Brewfile`). No build step; commit = deploy on next YADM sync. `##os.<OS>` suffix picks per-platform files; bootstraps at `.config/yadm/bootstrap##os.{Darwin,Linux}`.

## Commands

No tests, build, or linter. `script/doctor` is the closest to a test — run after any tooling change.

| Command | Purpose |
|---------|---------|
| `script/setup` | First-time macOS: Homebrew, `brew bundle --global`, Fish login shell, Fisher. |
| `script/doctor` | Health check — core tools, shell, git, mise, Neovim, tmux/TPM. |
| `yadm bootstrap` | Re-run platform bootstrap. |
| `brew bundle --global` | Re-sync after `.Brewfile` edit. |
| `:lua vim.pack.update()` | Update Neovim plugins; commit `nvim-pack-lock.json`. |

## Architecture

### Two-platform split

- **macOS** → Fish (`.config/fish/config.fish`) + Starship + Homebrew (`.Brewfile`).
- **Linux / Codespaces** → Bash (`.bash_aliases##os.Linux`), no Starship. Bootstrap pulls releases via `gh` (arch-aware amd64/arm64); no Homebrew.

Shared: `mise`, `EDITOR=nvim`, core aliases (`lg`, `gp`, `vi`, `vim`). Shell-level features usually need both `config.fish` and `.bash_aliases##os.Linux`.

Machine-local secrets: `.config/fish/local_env.fish` (gitignored, `.example` checked in) or `.bash_aliases.local`.

### Neovim — native, no framework

**No LazyVim, lazy.nvim, or Mason.** `vim.pack.add()` only. Read `.config/nvim/init.lua` first for anything plugin-related — it is the full plugin manifest and config.

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

`.config/fish/` = `config.fish`, `fish_plugins` (Fisher), `functions/` (one fn per file, filename must match function name). Non-obvious helpers: `gloan` (clones into `~/src/{owner}/{repo}`), `github_token` (1Password).

### Git / Tmux / Terminal

- **Git**: GPG signing on, `diff-so-fancy` pager, `pull.rebase`, default branch `main`. Aliases: `co` (fzf checkout), `cs` (signed commit), `up` (pull --rebase).
- **Tmux**: prefix `Ctrl-f`, base index 1, vim copy-mode, Catppuccin Mocha, plugins via TPM (`prefix + I`).
- **iTerm2**: not tracked — changes too often. Don't edit here.

## Dev focus

Ruby/Rails primary — Sorbet (`vscode_sorbet`), ruby-lsp, Rubocop (`.rubocop.yml`), vim-rails, `.pryrc`. Also Go (gopls, gofumpt, goimports), Lua (lua_ls, stylua), Node, Rust, Python, .NET via mise.
