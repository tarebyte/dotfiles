# CLAUDE.md

Personal dotfiles. **GNU stow**-managed — source tree is organized into packages (`common/`, `darwin/`, `codespaces/`) that mirror `$HOME`. Files live at their real names (no `dot_` prefix); stow creates symlinks from `$HOME` into the repo. Repo-management files (`README.md`, `CLAUDE.md`, `LICENSE`, `script/`, `Makefile`, `templates/`) sit at the source root, outside every package, so stow never touches them. Per-OS gating is handled by which packages you stow — no `.chezmoiignore`, no ignore file at all.

## Commands

No tests, build, or linter. `script/doctor` is the closest to a test — run after any tooling change.

| Command | Purpose |
|---------|---------|
| `script/setup` | First-time entry point. Installs `stow` via Homebrew/apt if missing, then runs `make install`. Auto-run by Codespaces. |
| `script/doctor` | Health check — core tools, shell, git, mise, Neovim, tmux/TPM. Also checks that `~/.config/git/config` matches the template (warns on drift). |
| `make install` | Generate `~/.config/git/config` from the template (prompting for identity on first run), stow `common`. On macOS also stow `darwin`, install brew bundle, update fisher, chsh to fish. |
| `make regen-git-config` | Re-render `~/.config/git/config` from `templates/git-config.tmpl` + `~/.config/dotfiles/identity.env`. Run this after editing the template. |
| `make brew` | Re-run `brew bundle --global` after editing `darwin/.Brewfile`. |
| `make fisher` | Bootstrap fisher if needed and run `fisher update` after editing `common/.config/fish/fish_plugins`. |
| `make mise` | `mise trust && mise install` after editing `common/.config/mise/config.toml`. |
| `make clean` | `stow -D` every package — cleanly unlinks everything from `$HOME`. Does NOT delete `~/.config/git/config` or `~/.config/dotfiles/identity.env`. |
| `make install` | The recovery incantation — re-runs the full install including `$(STOW) -t $HOME common` etc. Always prefer this over a raw `stow` invocation because the Makefile's `STOW` variable carries the required `--no-folding` flag. |
| `:Lazy sync` | Update/install Neovim plugins via lazy.nvim; commit `lazy-lock.json`. |

Stow symlinks files from the package into `$HOME`, so editing `~/.config/fish/config.fish` edits `common/.config/fish/config.fish` transparently. `git diff` in the repo shows your change immediately — no `apply`, no `re-add`, no drift. When you add a *new* tracked file inside a package, run `make install` so stow creates its symlink in `$HOME`.

If you ever need to invoke `stow` manually (e.g. for dry-run debugging), always include `--no-folding` — see the paragraph below for why. Dry-run example: `stow -n -v --no-folding -t $HOME common`.

**Why `--no-folding`:** every `stow` invocation in this repo passes `--no-folding` (see the `STOW` variable in the Makefile). With folding enabled, stow creates a single directory-level symlink when a package subtree is new in `$HOME` — e.g. `~/.config/fish` would become a symlink pointing at `common/.config/fish`. That's minimal-symlink-count, but it means any runtime write a tool does inside `~/.config/fish/` (fish writing `fish_variables`, fisher writing `conf.d/` and `completions/`) silently propagates *through the symlink into the repo source*, polluting the stow package with untracked files. `--no-folding` makes every directory in `$HOME` a real directory containing individual per-file symlinks, so:

- Edits to *tracked* files (`config.fish`, `lazy-lock.json`, etc.) still go through their per-file symlinks into the repo source, exactly as before.
- *New* files written at runtime (`fish_variables`, `conf.d/foo.fish`, `completions/bar.fish`, whatever) land in real `$HOME` paths and never enter the repo. They're the same as any other per-machine file.
- Adding a new tracked file is deliberate: create it in the package, run `stow -R` (or `make install`), and the per-file symlink appears in `$HOME`.

Defense-in-depth: the root `.gitignore` also lists a handful of known runtime-state paths inside packages, so if `--no-folding` is ever accidentally dropped, those files still won't get committed.

**The one exception is git config**, which is generated at install time rather than stow-symlinked. See "Git identity layout" below.

### Scripts

The `Makefile` is a thin dispatcher; real logic lives in `script/` so each piece is independently testable and shellcheck-clean:

| Script | Purpose |
|---|---|
| `script/setup` | Bootstrap — installs `stow` if missing, then runs `make install`. `#!/bin/sh` (POSIX). |
| `script/setup-git-config` | Renders `templates/git-config.tmpl` → `~/.config/git/config` using `~/.config/dotfiles/identity.env`. Prompts on first run (TTY-guarded), atomic temp+mv write, sed-escaped substitution. Bash. |
| `script/install-darwin` | macOS bootstrap: installs Homebrew if missing + sources `brew shellenv`, stows `darwin`, runs `make brew fisher`, registers fish in `/etc/shells` (line-exact match), chsh to fish. Bash. |
| `script/install-codespace-tools` | Codespaces bootstrap: downloads nvim/rg/bat/fzf/lazygit/diff-so-fancy/tree-sitter via `gh release download --latest`. Bash, `set -euo pipefail`. |
| `script/doctor` | Health check. Includes a template-drift check that re-renders `templates/git-config.tmpl` against `identity.env` and `cmp -s`'s against the live file; warns if they differ. Bash. |

All five pass `shellcheck -x`. Run it after any script edit:
```sh
shellcheck -x script/setup script/setup-git-config script/install-darwin script/doctor script/install-codespace-tools
```

## Git identity layout

Git config is the one dotfile that **isn't** stow-symlinked. Instead, it's rendered from a template at install time, because VS Code Dev Containers copies `~/.config/git/config` **verbatim** but does NOT follow `[include]` directives ([vscode-remote-release#3331](https://github.com/microsoft/vscode-remote-release/issues/3331)). To give devcontainers a working git config with aliases, colors, filters, AND identity all inlined in one file, the template has everything inlined and identity gets substituted at install time.

### Files

- `templates/git-config.tmpl` — committed plain text, the full static git config (aliases, colors, filters, core, pull, push, etc.) plus hardcoded `[user] name = Mark Tareshawty`, `[commit] gpgsign = true`, `[github] user = tarebyte`, with two placeholders `{{EMAIL}}` and `{{SIGNINGKEY}}` in the `[user]` section. Ends with `[include] path = ~/.config/git/config.darwin`. Not in any stow package — it's a source file for code generation.
- `~/.config/dotfiles/identity.env` — **per-host, not in the repo**. Plain shell-sourceable file with `EMAIL=...` and `SIGNINGKEY=...`. Created on first `make install` by prompts; mode 600. Edit this file to rotate keys or change emails, then run `make regen-git-config`.
- `~/.config/git/config` — **generated at install time**, real file (NOT a symlink). Rendered by substituting the two placeholders from `identity.env` into the template. This is the file devcontainers copy.
- `darwin/.config/git/config.darwin` — macOS-only credential helper (`osxkeychain`) and `gpg.program` path. Still stow-symlinked from the `darwin` package, `[include]`d from the generated `~/.config/git/config`. Inside Linux devcontainers the include silently no-ops (correct — osxkeychain doesn't exist there).
- `common/.config/git/ignore` — global gitignore, regular stow symlink.

### Edit flow

- **Add an alias / change a color / edit a filter:** edit `templates/git-config.tmpl`, run `make regen-git-config` to propagate to `~/.config/git/config` on this host. To propagate to another host, pull and run `make regen-git-config` there.
- **Rotate a GPG signing key or change email:** edit `~/.config/dotfiles/identity.env`, run `make regen-git-config`. The template is unchanged; only the generated output picks up the new values.
- **First-time install on a fresh host:** `make install` sees the missing `identity.env`, prompts once for email and GPG key, writes `identity.env` (mode 600), renders the config, continues with stow + brew bundle. Subsequent `make install` runs are silent because `identity.env` already exists.
- **Inspect live config:** `cat ~/.config/git/config` or `git config --list --show-origin`. The file is regular and readable — just don't edit it directly, or your edits will be clobbered by the next `make regen-git-config`. `script/doctor` catches this: it re-renders the template against `identity.env` and warns if it differs from the live file.

### Why not stow-symlink it?

Because the template has placeholders (`{{EMAIL}}`, `{{SIGNINGKEY}}`) that need to become real values before git can read the file. Stow would symlink the placeholder-bearing file straight into `$HOME`, and git would break on the invalid `user.email`. An intermediate substitution step is required, and the cleanest place to do it is at install time.

### Why inline everything instead of using `[include]` for the static parts?

Because devcontainers don't follow `[include]`. If static content lived in a separate file referenced via `[include]`, the container would only see identity — no aliases, no colors, no filters. Inlining the static content into the generated file means devcontainers get the full experience.

The one exception is `darwin/.config/git/config.darwin` which IS `[include]`d, and that's intentional: the `[include]` silently fails inside Linux containers, which is correct because `osxkeychain` doesn't exist there.

### Why is identity not committed to the repo?

It could be — name, email, signing key ID, and GitHub username are all already public via `git log` and `git log --show-signature` on github.com, so committing them leaks nothing new. But keeping them in a per-host `identity.env` outside the repo means:
1. Different hosts can use different values (work mac with work GPG key + work email, personal mac with personal values) without committing both to the repo.
2. A forker of this repo gets prompted for their own values on first `make install` instead of inheriting Mark's.

The tradeoff is the one "generated file with a source of truth elsewhere" in the setup. Everything else is stow-symlinked and edit-in-place.

## Architecture

### Multi-package split

- **`common/`** — shared on every host: fish, nvim, mise, starship, tmux, ctags, dircolors, gemrc, pryrc, rubocop, terminfo, `git/ignore` (global gitignore).
- **`darwin/`** — any macOS host: `.Brewfile`, macOS-only scripts (`pb-pem`, `ssh-copy-id`, `touchid-enable-pam-sudo`), `git/config.darwin` (osxkeychain + gpg.program).
- **`codespaces/`** — Codespaces only: `.bash_aliases`, `.oh-my-zsh/`, Linux-only scripts (`gh-prepare`).

Git config isn't in any stow package — it's rendered from `templates/git-config.tmpl` + `~/.config/dotfiles/identity.env` at `make install` time. See the "Git identity layout" section above.

`make install` picks the right packages based on `uname -s` (darwin gates `install-darwin`) and `$CODESPACES` (gates `install-codespaces`). No `CONTEXT` env var — each host's identity file is what makes it "personal" or "work".

### Two-platform feature split

- **macOS** → Fish (`common/.config/fish/config.fish`) + Starship + Homebrew (`darwin/.Brewfile`). `make install-darwin` installs Homebrew, stows `darwin`, runs `brew bundle`, bootstraps fisher, adds fish to `/etc/shells`, `chsh`s to fish.
- **Codespaces** → `codespaces/.bash_aliases` (no Fish, no Starship). `make install-codespaces` calls `script/install-codespace-tools` which pulls nvim/rg/bat/fzf/lazygit/diff-so-fancy/tree-sitter via `gh release download` (arch-aware amd64/arm64). No Homebrew, no mise. Stays on bash.

Shared: `common/.config/mise/config.toml`, `EDITOR=nvim`, core aliases (`lg`, `gp`, `vi`, `vim`). Shell-level features usually need both `config.fish` and `codespaces/.bash_aliases`.

Machine-local secrets on Codespaces come from user-defined Codespaces secrets. On Darwin, add them yourself — there is currently no machine-local env file in the tracked layout.

### Neovim — LazyVim base + manual LSP

Built on **LazyVim** (`lazy.nvim` under the hood). Mason is disabled — LSP servers are installed by mise/system and configured inline in `lua/plugins/lsp.lua` via `opts.servers`. No Mason, no `ensure_installed` for language servers.

Layout under `common/.config/nvim/`:
- `init.lua` — 3-line stub: sets leader and `require("config.lazy")`.
- `lua/config/lazy.lua` — bootstraps lazy.nvim and imports `lazyvim.plugins` + local `plugins/`. The enabled LazyVim extras live in `lazyvim.json` (managed by `:LazyExtras`), not in this file.
- `lazyvim.json` — tracks the enabled extras and news-read state. Commit changes after toggling extras.
- `lua/config/options.lua` — only the deltas from LazyVim defaults (`gdefault`, `cmdheight=0`, `listchars`, `updatetime`, `relativenumber=false`, `pumblend=0`).
- `lua/config/keymaps.lua` — only our custom keymaps on top of LazyVim's.
- `lua/config/autocmds.lua` — custom autocmds (CursorHold diagnostic float, gotmpl filetype + parser aliases).
- `lua/plugins/colorscheme.lua` — LazyVim `colorscheme` opt + catppuccin flavour, highlights, lualine palette integration.
- `lua/plugins/ui.lua` — lualine sections, snacks dashboard + picker/notifier/statuscolumn/explorer, nvim-web-devicons.
- `lua/plugins/disabled.lua` — single place for LazyVim plugins we turn off: `bufferline.nvim`, `mason.nvim`, `mason-lspconfig.nvim`, `neo-tree.nvim`.
- `lua/plugins/coding.lua` — blink.cmp Tab/S-Tab cycling + sources, disable for mini.surround.
- `lua/plugins/gitsigns.lua` — gitsigns `numhl` only (no current-line blame).
- `lua/plugins/noice.lua` — noice routes/presets.
- `lua/plugins/lsp.lua` — registers the Ruby servers (`ruby_lsp`, `vscode_sorbet`, `vscode_sorbet_rubocop`) via `opts.servers`, and sets `opts.diagnostics`. Mason itself is disabled in `disabled.lua`.
- `lua/plugins/editing.lua` — vim-surround, vim-repeat, vim-eunuch, vim-projectionist, vim-rails, vim-better-whitespace, vim-dirvish + dirvish-git.
- `lua/plugins/treesitter.lua` — parser list additions, treesitter-context, treesitter-textobjects, endwise.
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

Adding an LSP: add `<name> = { ... }` to `opts.servers` in `lua/plugins/lsp.lua` with the full `vim.lsp.Config` table inline.

Formatting: LazyVim's default `conform.nvim` wiring, untouched. Format-on-save runs through `LazyVim.format`, Lua uses `stylua`, Go uses `goimports` + `gofumpt`, everything else falls back to the LSP formatter.

### Fish

`common/.config/fish/` = `config.fish`, `fish_plugins` (Fisher), `functions/` (one fn per file, filename must match function name). Non-obvious helpers: `gloan` (clones into `~/src/{owner}/{repo}`), `github_token` (1Password).

### Git / Tmux / Terminal

- **Git**: see the "Git identity layout" section above for the template-based setup. All static config (aliases: `co` fzf checkout, `cs` signed commit, `up` pull --rebase; GPG signing on; diff-so-fancy pager; `pull.rebase`; default branch `main`) lives in `templates/git-config.tmpl`. macOS credential helper in `darwin/.config/git/config.darwin`.
- **Tmux**: prefix `Ctrl-f`, base index 1, vim copy-mode, Catppuccin Mocha, plugins via TPM (`prefix + I`).
- **iTerm2**: not tracked — changes too often. Don't edit here.

## Adding a file

1. Put it in the right package:
   - Cross-platform → `common/`
   - macOS-only → `darwin/`
   - Codespaces-only → `codespaces/`
2. Use real filenames (no `dot_` prefix). Ensure executables are `chmod +x` in git (`git update-index --chmod=+x path`).
3. Run `make install` to create the symlink in `$HOME`. (Because `--no-folding` is on, every file needs its own symlink — `make install` is idempotent and will create just the new one.)

If a tool wrote a file into a config directory at runtime (e.g. `funced` created `~/.config/fish/functions/newfunc.fish` as a real file in `$HOME`, not through a symlink), and you decide you *do* want it tracked:

```sh
mv ~/.config/fish/functions/newfunc.fish ~/.local/share/chezmoi/common/.config/fish/functions/
make install
```

(Git config is the one exception — don't add it to a stow package. Edit `templates/git-config.tmpl` and run `make regen-git-config`.)

## Dev focus

Ruby/Rails primary — Sorbet (`vscode_sorbet`, `vscode_sorbet_rubocop`), ruby-lsp, Rubocop (`common/.rubocop.yml`), vim-rails, `common/.pryrc`. Also Go (gopls + gofumpt + goimports via the `lang.go` LazyVim extra, binaries from mise), Lua (lua_ls, stylua), Node, Rust, Python, and .NET via mise. Because Mason is disabled, the `ensure_installed` entries inside LazyVim language extras are silent no-ops — any tool they want must be provided by mise or the system.
