# ~/

My macOS and GitHub Codespaces dotfiles, managed with [GNU Stow](https://www.gnu.org/software/stow/).

## Install

```sh
git clone https://github.com/tarebyte/dotfiles ~/.dotfiles && cd ~/.dotfiles && ./script/setup
```

On macOS, the first run prompts for the email and signing key used by Git. Codespaces use the identity provided by the environment.

Re-run `make install` at any time to apply changes or repair the installation.

## Included

- Fish, Starship, and tmux
- Neovim with LazyVim
- Git configuration and aliases
- Language runtimes and editor tooling through mise
- Homebrew applications and command-line tools
- Bash/Zsh configuration and bootstrap tooling for [GitHub Codespaces](https://docs.github.com/en/codespaces/customizing-your-codespace/personalizing-codespaces-for-your-account#dotfiles)

## Commands

| Command | Purpose |
|---|---|
| `make install` | Install or refresh the dotfiles. |
| `make test` | Run shell checks and functional tests. |
| `script/doctor` | Check the installed environment. |
| `make regen-git-config` | Regenerate Git config after changing its template or identity. |
| `make clean` | Unlink the active Stow packages. |

## Customizing

- Edit `templates/git-config.tmpl`, then run `make regen-git-config`.
- Per-host Git email and signing key live in
  `~/.config/local/git/identity.gitconfig`; regenerate after changing them.
- Put machine-local Fish environment variables in `~/.config/fish/local_env.fish`.
- Add cross-platform files under `common/`, macOS files under `darwin/`, and Codespaces files under `codespaces/`.

Implementation details and contributor guidance are in [AGENTS.md](AGENTS.md).

## Thanks to...

* [Zach Holman](https://github.com/holman/dotfiles)
* [Jason Long](https://github.com/jasonlong/dotfiles)
* [Wynn Netherland](https://github.com/pengwynn/dotfiles)
* [Brooks Swinnerton](https://github.com/bswinnerton/dotfiles)
