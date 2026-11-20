# AGENTS.md

Personal dotfiles, managed with **GNU stow**. The packages `common/`, `darwin/`, and `codespaces/` mirror `$HOME`; files use their real names (no `dot_` prefix). Repo-management files (`README.md`, `AGENTS.md`, `LICENSE`, `script/`, `Makefile`, `templates/`) sit outside every package, so stow never touches them. Per-OS gating is handled by which packages you stow.

## Commands

Run `make test` after any script edit. `script/doctor` checks the installed environment on this host, not the repo.

| Command | Purpose |
|---------|---------|
| `script/setup` | First-time entry point. Installs `stow` if missing, then runs `make install`. Auto-run by Codespaces. |
| `make install` | Render `~/.config/git/config` (prompts for identity on first run), stow `common`, then the platform extras (`install-darwin` on macOS, `install-codespaces` when `$CODESPACES` is set), then `mise`. Safe to re-run; it is also the recovery command. |
| `make test` | `shellcheck -x` on every script under `script/` (found via `git ls-files`), then `script/test`. |
| `make regen-git-config` | Re-render `~/.config/git/config` after editing the template or the identity file. |
| `make brew` | `brew bundle --global` after editing `darwin/.Brewfile`. |
| `make fisher` | Bootstrap fisher and run `fisher update` after editing `common/.config/fish/fish_plugins`. |
| `make macos-preferences` | Reapply macOS preferences (Caps Lock → Control LaunchAgent, Lock Screen hot corner, `~/Pictures/Screenshots`). |
| `make mise` | Install mise on macOS if needed, then `mise trust && mise install`. |
| `make sync-codespace-plugins` | Re-sync Neovim and tmux plugins in a Codespace. |
| `make clean` | `stow -D` the active packages. Leaves the generated git config and identity file. |

Editing `~/.config/fish/config.fish` edits `common/.config/fish/config.fish` through its symlink, so `git diff` shows the change at once. After adding a *new* file to a package, run `make install` to create its symlink.

**Always pass `--no-folding` to stow** (the Makefile's `STOW` variable does). Without it, stow links whole directories, and runtime writes such as `fish_variables` or fisher's `conf.d/` land inside the repo. Dry run: `stow -n -v --no-folding -t $HOME common`. Known runtime-state paths are listed in both `common/.stow-local-ignore` and `.gitignore`; keep the two in sync.

### Scripts

The `Makefile` only dispatches; the logic lives in `script/`, and each script documents its own internals. Non-obvious points:

- `script/stow-package` moves files that block a stow to `~/.dotfiles-backup/<timestamp>/` and never deletes user files. It finds conflicts by inspecting the filesystem, not by parsing stow's messages, which change between versions.
- `script/setup` waits up to 300s for the dpkg lock, because unattended-upgrades can hold it while a Codespace is created. In Codespaces it then touches `~/.local/state/gh-csd/setup-complete`, which the `gh csd` extension watches.
- `script/install-codespace-tools` installs binaries from a flat list of `install_tool` calls at the bottom of the file. `tool_ready` requires each tool to be on PATH **and** to run, so a binary broken by a glibc mismatch is reinstalled. tree-sitter falls back to a cargo build when the prebuilt binary won't run. There is deliberately no glibc version check, because the prebuilt floor keeps rising. nvim-treesitter needs the `tree-sitter` CLI to build parsers.
- `script/sync-codespace-plugins` syncs plugin state (headless `Lazy! sync` + `TSUpdateSync`, and TPM). It is separate from tool installation so it can be re-run alone.
- `script/test` runs each test in its own `mktemp` sandbox with a stubbed `$HOME`; nothing touches the real system.

### CI

`.github/workflows/ci.yml`:

- **`test`** — `make test`. The runner's preinstalled shellcheck is older than Homebrew's, so a local `make test` is the stricter check.
- **`fish`** — `fish -n` on every tracked `.fish` file (`xargs -n1`, so one bad file fails the job).
- **`lua`** — `stylua --check`, with the version taken from `common/.config/mise/config.toml` via `MISE_GLOBAL_CONFIG_FILE`. Moving that file requires updating CI. A new stylua major version may reformat files; run it locally and commit the reflow in the same change.
- **`codespace-tools`** — runs `install-codespace-tools` on `ubuntu:22.04` (cargo fallback for tree-sitter) and `ubuntu:24.04` (prebuilt), then checks that every tool runs.
- **`apt-lock`** — holds the dpkg lock while `script/setup` runs, to prove apt waits for it.

Linting jobs find their files with `git ls-files`, never hardcoded paths. Follow that pattern for new validators.

`license-year.yml` is a separate scheduled workflow that bumps the year in `LICENSE`.

## Git identity layout

Git config is the one dotfile that **isn't** stow-symlinked. VS Code Dev Containers copy `~/.config/git/config` verbatim and don't follow `[include]` ([vscode-remote-release#3331](https://github.com/microsoft/vscode-remote-release/issues/3331)). So `script/setup-git-config` copies the static template and injects per-host values with `git config --file`, giving one flat file with aliases, colors, filters, and identity.

### Files

- `templates/git-config.tmpl` — committed static config. Its `[user]` section omits email and signing key. It ends with `[include] path = ~/.config/git/config.darwin`.
- `~/.config/local/git/identity.gitconfig` — per-host, untracked, mode 600. Holds `user.email` and an SSH public key in `user.signingkey`. Created by prompts on the first `make install`. Different hosts can use different emails and keys.
- `~/.config/git/config` — generated real file. Don't edit it; `make regen-git-config` overwrites it, and `script/doctor` warns on drift.
- `~/.config/local/git/allowed_signers` — generated with the config so Git can verify its own SSH signatures. Put other people's keys in the untracked `allowed_signers.extra`, which is appended.
- `darwin/.config/git/config.darwin` — stowed and `[include]`d. Sets the `gh auth git-credential` helper (one credential to rotate, not a second one in the keychain) and 1Password's `op-ssh-sign`. The include silently does nothing in Linux containers, which is correct because these paths exist only on the Mac.
- `darwin/.ssh/config` — points `IdentityAgent` at 1Password. It includes `~/.ssh/config.d/*` before `Host *`; put per-host SSH config there (starter: `templates/ssh-config.example`), never in a package.
- `~/.config/1Password/ssh/agent.toml` — optional per-host key selection (starter: `templates/1password-ssh-agent.toml.example`).

Older identity locations and formats are migrated automatically on the next render.

**Codespaces:** Codespaces injects its own `~/.gitconfig` with identity and a credential helper. `setup-git-config` then skips `identity.gitconfig`, strips `[user]`, sets `commit.gpgsign = false`, and drops the `config.darwin` include. It never prompts, so an unattended bootstrap can't hang.

### Edit flow

- **Alias, color, or filter:** edit `templates/git-config.tmpl`, then `make regen-git-config` on each host.
- **Email or signing key:** edit `identity.gitconfig` with `git config --file`, then `make regen-git-config`.
- **Different 1Password key per Mac:** set it in that Mac's `agent.toml` and `identity.gitconfig`, and register the key with the Git host.

## Architecture

### Packages

- **`common/`** — every host: fish, nvim, mise, starship, tmux, fzf, htop, ctags, dircolors, gemrc, pryrc, rubocop, `git/ignore`, and `.claude/` (`CLAUDE.md`, output styles, skills).
- **`darwin/`** — macOS: `.Brewfile`, scripts in `.bin/`, `git/config.darwin`, `.ssh/config`, `.claude/statusline.sh`, herdr settings and Catppuccin themes, and the keyboard-remapping LaunchAgent.
- **`codespaces/`** — `.bash_aliases`, `.oh-my-zsh/`, `.bin/gh-prepare`.

`~/.claude/settings.json` is not stowed. `script/install-darwin` copies `templates/claude-settings.json` there once and never again, because Claude Code writes machine-specific settings to it. Change shared keys (hooks, `statusLine`, `attribution`) in the template and by hand on each Mac. Work-only instructions go in untracked `~/.claude/rules/`.

### Platforms

- **macOS** — fish + Starship + Homebrew + mise.
- **Codespaces** — bash, no Homebrew, no mise. `install-codespace-tools` provides a smaller tool set and no language servers, so `lsp.lua` attaches fewer servers there. **Supported floor: Ubuntu 22.04**; 20.04's glibc can't run the prebuilt Neovim, and `via_nvim` has no fallback.

Shell-level features usually need both `config.fish` and `codespaces/.bash_aliases`. Per-host values go in Codespaces secrets, or on macOS in `~/.config/fish/local_env.fish` (copy the tracked `.example`).

### Neovim — LazyVim base + manual LSP

Config lives in `common/.config/nvim/`. **Mason is disabled.** Language servers and formatters come from mise and are configured in `lua/plugins/lsp.lua` under `opts.servers`. The `ensure_installed` lists inside LazyVim extras do nothing, so declare any tool they want in mise.

- Extras are toggled with `:LazyExtras` and saved in `lazyvim.json`; commit that file.
- `lazy-lock.json` is gitignored and Stow-ignored on purpose, so plugin versions are not pinned across machines.
- Breadcrumbs in the winbar come from `dropbar.nvim` (`lua/plugins/ui.lua`), using a custom source that runs `queries/<lang>/outline.scm` (copied from Zed). Add an outline query to give a language breadcrumbs.

Conventions (intentional — don't "fix"):
- Leader is `,`, set in `lua/config/options.lua` because LazyVim's options would override an earlier value.
- Absolute line numbers, `cmdheight = 0`.
- Theme: Catppuccin Mocha, matching tmux.
- File explorer: vim-dirvish; neo-tree, bufferline, and friendly-snippets are disabled in `lua/plugins/disabled.lua`.
- Surround: vim-surround, not mini.surround.
- `harper_ls` and `setlocal spell` share `spell/en.utf-8.add`. Add words in one place.
- Formatting is LazyVim's default `conform.nvim` setup.

### Fish

`common/.config/fish/`: `config.fish`, `fish_plugins`, and `functions/` (one function per file, named after it). `conf.d/` is not tracked; fish and fisher write it.

- `refresh_github_token` calls `env -u GH_TOKEN -u GITHUB_TOKEN gh auth token`. Some tools inject a narrow `GH_TOKEN` that would otherwise hide the keyring token, which has `read:packages`.
- **Don't replace the hand-written Homebrew env block in `config.fish` with `eval (brew shellenv)`.** It avoids a subprocess on every shell start.

### Tool provisioning (mise vs Homebrew)

The rule is **"does Neovim invoke it?"** If yes, declare it in `common/.config/mise/config.toml`; otherwise Homebrew is fine. Without Mason, a server missing from mise never attaches. Example: `harper-ls` is in mise only; `shellcheck`, used only by `make test`, is in Homebrew only.

- **`ruby-lsp`** is installed by a `postinstall` hook on `ruby`, not the `gem` backend, whose isolated `GEM_HOME` can't see `ruby-lsp-rails`. The hook runs only when ruby is installed, and `--force` reinstalling ruby discards hand-installed gems.
- **`tree-sitter` breaks the rule.** On macOS it comes from the Brewfile (`tree-sitter`, `tree-sitter-cli`). If you move it to mise, delete both Brewfile lines in the same change, or the brew copy wins on PATH.
- `config.fish` activates `~/.local/bin/mise` by its exact path. Homebrew's bin is still ahead on PATH, so a brew copy of a mise tool shadows it.

Wrong tool version? Compare `mise which <tool>` with `type -a <tool>`. mise's `rust` puts `~/.cargo/bin` first, so a `cargo install`ed binary can shadow a mise pin, even through `mise exec`.

### Git / Tmux

- **Git** aliases: `co` checkout, `cor` fzf checkout, `cs` signed commit, `up` pull --rebase, plus `br`/`cp`/`st`. All in `templates/git-config.tmpl`.
- **Tmux**: prefix `Ctrl-f`, base index 1, vim copy-mode, Catppuccin Mocha, TPM plugins (`prefix + I`).

## Adding a file

1. Put it in `common/` (cross-platform), `darwin/` (macOS), or `codespaces/`.
2. Use the real filename. Mark executables with `git update-index --chmod=+x path`.
3. Run `make install` to create its symlink.

To track a file a tool wrote at runtime, move it into the package and run `make install`. Git config is the exception: edit the template.

## Removing a file

**Unstow before you delete.** Stow finds links by walking the package, so a link to a file already deleted from the package is left dangling.

```sh
make clean
git rm -r common/.some-thing
make install
```

If you already deleted it, find the dangling links and check each before removing it:

```sh
for l in $(find ~/.some-thing -type l); do [ -e "$l" ] || echo "DANGLING $l -> $(readlink "$l")"; done
```

## Dev focus

Ruby/Rails first (Sorbet, ruby-lsp, RuboCop, vim-rails, pry), then Go, Lua, Node, and Rust. All their tools come from mise.
