# ~/

My dotfiles: fish, Neovim, tmux, git, and the tooling around them. Managed with
[GNU stow](https://www.gnu.org/software/stow/) — files live at their real names
in this repo and get symlinked into `$HOME`.

## To install

```sh
git clone https://github.com/tarebyte/dotfiles ~/.dotfiles && cd ~/.dotfiles && ./script/setup
```

`script/setup` installs `stow` if it's missing, then runs `make install`. On
first run it prompts once for the git identity (email + signing key) used to
generate `~/.config/git/config`.

Meant primarily for macOS, but also works for [GitHub Codespaces](https://docs.github.com/en/codespaces/customizing-your-codespace/personalizing-codespaces-for-your-account#dotfiles)
if that's your jam.

## Layout

Each top-level directory is a stow package mirroring `$HOME`, so
`common/.config/fish/config.fish` lands at `~/.config/fish/config.fish`.
Which packages get stowed is decided by the platform, not by a config flag.

| Package | Stowed on |
|---|---|
| `common/` | everywhere — fish, Neovim, tmux, mise, starship, global gitignore |
| `darwin/` | macOS — `.Brewfile`, macOS-only scripts, keychain git config |
| `codespaces/` | Codespaces — bash aliases, Linux-only scripts |

Everything else at the root (`script/`, `templates/`, `Makefile`, this file)
sits outside every package, so stow never links it into `$HOME`.

Because stow symlinks individual files, editing `~/.config/fish/config.fish`
edits the copy in this repo directly — `git diff` shows it immediately. When you
add a *new* file to a package, run `make install` so stow links it.

## Common commands

| Command | Purpose |
|---|---|
| `make install` | Install/refresh everything. Idempotent — also the recovery step. |
| `make test` | `shellcheck` every script, then run `script/test`. |
| `script/doctor` | Health check the installed environment on this machine. |
| `make brew` | Re-run `brew bundle` after editing `darwin/.Brewfile`. |
| `make fisher` | Sync fish plugins after editing `fish_plugins`. |
| `make mise` | Install tools after editing `mise/config.toml`. |
| `make clean` | Unlink every package from `$HOME`. |

## Customizing

- **Git identity** lives in `~/.config/dotfiles/identity.env` (per-machine, not
  committed). `~/.config/git/config` is generated from
  `templates/git-config.tmpl` — edit the template for aliases and settings, then
  run `make regen-git-config`. Don't edit the generated file directly.
- **Machine-local env vars and secrets** go in `~/.config/fish/local_env.fish`,
  which is gitignored. Copy `local_env.fish.example` to start.

## Notes

Language runtimes, language servers, linters, and formatters come from
[mise](https://mise.jdx.dev) (`common/.config/mise/config.toml`). Applications
and shell infrastructure come from Homebrew (`darwin/.Brewfile`).

Deeper detail — why stow runs with `--no-folding`, why git config is generated
instead of symlinked, how the Codespaces bootstrap works, and the Neovim
layout — is in [AGENTS.md](AGENTS.md).

## Thanks to...

* [Zach Holman](https://github.com/holman/dotfiles)
* [Jason Long](https://github.com/jasonlong/dotfiles)
* [Wynn Netherland](https://github.com/pengwynn/dotfiles)
* [Brooks Swinnerton](https://github.com/bswinnerton/dotfiles)
