# ~/

My macOS and GitHub Codespaces dotfiles, managed with [GNU Stow](https://www.gnu.org/software/stow/).

## Install

```sh
git clone https://github.com/tarebyte/dotfiles ~/.dotfiles && cd ~/.dotfiles && ./script/setup
```

On macOS, the first run prompts for the email and SSH signing public key used by Git. Codespaces use the identity provided by the environment.

Re-run `make install` at any time to apply changes or repair the installation.

## Included

- Fish, Starship, and tmux
- Neovim with LazyVim
- Git configuration and aliases
- Language runtimes and editor tooling through mise
- Homebrew applications and command-line tools
- macOS preferences, including Caps Lock mapped to Control and a bottom-right
  hot corner that locks the screen
- Bash/Zsh configuration and bootstrap tooling for [GitHub Codespaces](https://docs.github.com/en/codespaces/customizing-your-codespace/personalizing-codespaces-for-your-account#dotfiles)

## Commands

| Command | Purpose |
|---|---|
| `make install` | Install or refresh the dotfiles. |
| `make macos-preferences` | Reapply macOS preferences. |
| `make test` | Run shell checks and functional tests. |
| `script/doctor` | Check the installed environment. |
| `make regen-git-config` | Regenerate Git config after changing its template or identity. |
| `make clean` | Unlink the active Stow packages. |

## Customizing

- Edit `templates/git-config.tmpl`, then run `make regen-git-config`.
- Per-host Git email and SSH signing public key live in
  `~/.config/local/git/identity.gitconfig`; regenerate after changing them.
- 1Password SSH key selection is also per-host. If a key is outside a default
  vault, copy `templates/1password-ssh-agent.toml.example` to
  `~/.config/1Password/ssh/agent.toml` and select that machine's item and vault.
- Put machine-local Fish environment variables in `~/.config/fish/local_env.fish`.
- Add cross-platform files under `common/`, macOS files under `darwin/`, and Codespaces files under `codespaces/`.

Implementation details and contributor guidance are in [AGENTS.md](AGENTS.md).

## Thanks to...

* [Zach Holman](https://github.com/holman/dotfiles)
* [Jason Long](https://github.com/jasonlong/dotfiles)
* [Wynn Netherland](https://github.com/pengwynn/dotfiles)
* [Brooks Swinnerton](https://github.com/bswinnerton/dotfiles)
