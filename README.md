# ~/

Personal dotfiles, managed with [GNU stow](https://www.gnu.org/software/stow/).

## To install

```sh
git clone https://github.com/tarebyte/dotfiles ~/.dotfiles && cd ~/.dotfiles && ./script/setup
```

`script/setup` installs `stow` (via Homebrew on macOS, `apt` on Linux) if it's missing, then runs `make install`. On first run, `make install` will prompt once for your git email and GPG signing key ID — these get saved to `~/.config/dotfiles/identity.env` (per-host, not committed) and substituted into `~/.config/git/config` from `templates/git-config.tmpl`. Subsequent installs are silent.

After that it stows the right packages for your host and bootstraps tooling: Homebrew + brew bundle + fisher + chsh to fish on macOS; neovim, ripgrep, fzf, lazygit, etc. on Codespaces.

Meant primarily for macOS, but also works for [GitHub Codespaces](https://docs.github.com/en/codespaces/customizing-your-codespace/personalizing-codespaces-for-your-account#dotfiles) — Codespaces auto-runs `script/setup` from the pre-cloned dir and skips the git config generation (Codespaces injects its own `~/.gitconfig` anyway).

## Layout

- `common/` — shared on every host (fish, nvim, mise, starship, tmux, ctags, …)
- `darwin/` — macOS-only (Brewfile, osxkeychain credential helper, macOS scripts)
- `codespaces/` — Codespaces-only (bash aliases, oh-my-zsh, Linux scripts)
- `templates/git-config.tmpl` — rendered at install time into `~/.config/git/config`
- `~/.config/dotfiles/identity.env` — per-host git identity (email + GPG key), not committed

See `CLAUDE.md` for the full architecture notes, including why git config is templated instead of stow-symlinked (devcontainer compatibility).

## Thanks to...

* [Zach Holman](https://github.com/holman/dotfiles)
* [Jason Long](https://github.com/jasonlong/dotfiles)
* [Wynn Netherland](https://github.com/pengwynn/dotfiles)
* [Brooks Swinnerton](https://github.com/bswinnerton/dotfiles)
