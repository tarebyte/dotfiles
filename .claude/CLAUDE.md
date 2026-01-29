# Dotfiles Repository

Personal dotfiles managed with YADM (Yet Another Dotfiles Manager) for macOS and Linux.

## Quick Reference

| Tool | Config Location | Purpose |
|------|-----------------|---------|
| Neovim | `.config/nvim/` | Editor (LazyVim-based) |
| Fish | `.config/fish/` | Shell |
| Tmux | `.tmux.conf` | Terminal multiplexer |
| Git | `.config/git/` | Version control |
| Starship | `.config/starship.toml` | Shell prompt |
| Ghostty | `.config/ghostty/` | Terminal emulator |
| Mise | `.config/mise/` | Runtime version manager |

## Installation

### macOS
```bash
curl -fsSL https://raw.githubusercontent.com/tarebyte/dotfiles/main/script/setup | bash
```

### GitHub Codespaces
Set this repository as your dotfiles in [GitHub Codespaces settings](https://github.com/settings/codespaces).
Codespaces automatically runs `install.sh` which:
1. Symlinks configs to proper locations (`~/.config/nvim`, `~/.config/git`, etc.)
2. Installs tools: Neovim, ripgrep, bat, fzf, lazygit, mise, diff-so-fancy
3. Supports both amd64 and arm64 architectures

### What Bootstrap Does

**macOS** (`bootstrap##os.Darwin`):
1. Installs Homebrew (if missing)
2. Runs `brew bundle --global` from `.Brewfile`
3. Sets Fish as default shell
4. Installs Fisher plugins

**Codespaces** (`install.sh`):
1. Symlinks config files to `$HOME`
2. Downloads latest tool releases via `gh`
3. Keeps default Bash shell

## Architecture

### Shell Configuration

| Platform | Shell | Config File | Local Overrides |
|----------|-------|-------------|-----------------|
| macOS | Fish | `.config/fish/config.fish` | `.config/fish/local_env.fish` |
| Codespaces | Bash | `.bash_aliases##os.Linux` | `.bash_aliases.local` |

Both platforms are configured with:
- mise for runtime versions
- Same core aliases (`lg`, `gp`, `vi`, `vim`)
- `EDITOR=nvim`

macOS additionally has Starship prompt.

## Architecture

### Directory Structure

```
.
├── .config/
│   ├── nvim/           # Neovim (LazyVim)
│   ├── fish/           # Fish shell + functions
│   ├── git/            # Git config + ignore
│   ├── ghostty/        # Terminal emulator
│   ├── mise/           # Runtime versions
│   ├── starship.toml   # Prompt config
│   └── yadm/           # Bootstrap scripts
├── .Brewfile           # Homebrew packages
├── .tmux.conf          # Tmux configuration
├── .pryrc              # Ruby REPL config
├── .gemrc              # RubyGems config
├── .rubocop.yml        # Ruby linter
└── script/
    └── setup           # Initial setup script
```

### OS-Specific Files

YADM uses alternate files with `##os.<OS>` suffix:
- `bootstrap##os.Darwin` - macOS bootstrap
- `bootstrap##os.Linux` - Linux bootstrap

## Key Configuration Details

### Neovim

- **Framework**: LazyVim
- **Leader key**: `,` (comma)
- **Colorscheme**: primer-primitives (primer_dark_dimmed)
- **Disabled plugins**: bufferline, catppuccin, mason

Notable customizations:
- `gdefault = true` - substitutions replace all matches by default
- `relativenumber = false` - absolute line numbers only
- Custom Sorbet LSP configuration for Ruby

Plugin categories in `lua/plugins/`:
- `ui.lua` - colorscheme, statusline
- `editor.lua` - autopairs, gitsigns, whitespace
- `treesitter.lua` - language parsing
- `nvim-lspconfig.lua` - LSP servers
- `tpope.lua` - vim-rails, vim-surround, etc.
- `snacks.lua` - dashboard, explorer, picker
- `disabled.lua` - explicitly disabled plugins

### Fish Shell

Key environment variables:
- `EDITOR=nvim`
- `PROJECTS=$HOME/src`
- `DOTFILES=$PROJECTS/(whoami)/dotfiles`
- `GOPATH=$PROJECTS/go`

Abbreviations:
- `gp` → `git push`
- `tn` → `tmux new-session -A -s`
- `lg` → `lazygit`
- `:e` → `$EDITOR`
- `y` → `yadm`

Custom functions in `.config/fish/functions/`:
- `gloan` - Clone repos to `~/src/{owner}/{repo}`
- `brewup` - Update all Homebrew packages
- `github_token` - Get GitHub token from 1Password

Machine-specific settings go in `.config/fish/local_env.fish` (not tracked).

### Git

- GPG signing enabled by default
- Pager: diff-so-fancy
- Pull strategy: rebase
- Key aliases: `co` (checkout with fzf), `cs` (commit --sign), `up` (pull --rebase)

### Tmux

- Prefix: `Ctrl-f`
- Base index: 1
- Copy mode: vim keybindings
- Plugins via TPM: pain-control, sensible, yank, minimal-tmux-status

## Development Focus

This configuration is optimized for **Ruby/Rails development** with:
- Sorbet LSP integration
- Rubocop linting
- vim-rails, vim-bundler plugins
- Pry debugging aliases

Also supports: Go, Node.js, Rust, Python, .NET (via Mise)

## Common Tasks

### Adding a new Homebrew package
1. Add to `.Brewfile`
2. Run `brew bundle --global`

### Adding a Neovim plugin
1. Create or edit file in `.config/nvim/lua/plugins/`
2. Follow LazyVim plugin spec format

### Adding a Fish function
1. Create `.config/fish/functions/{name}.fish`
2. Function name must match filename

### Machine-specific configuration
1. Copy `.config/fish/local_env.fish.example` to `.config/fish/local_env.fish`
2. Add environment variables and settings (file is gitignored)

## Troubleshooting

### Run health check
```bash
script/doctor
```

### Neovim health check
```vim
:checkhealth
```

### Rebuild Neovim plugins
```vim
:Lazy sync
```

### Fish plugin update
```fish
fisher update
```

### Tmux plugin install
```
prefix + I  (Ctrl-f + I)
```
