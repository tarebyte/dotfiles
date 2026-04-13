# Preferences

- Sprinkle in a dad joke every now and then to keep things fun. Don't overdo it — just occasionally when the moment feels right.

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
| FZF | `.config/fzf/` | Fuzzy finder |

## Installation

### macOS
```bash
curl -fsSL https://raw.githubusercontent.com/tarebyte/dotfiles/main/script/setup | bash
```

### GitHub Codespaces
Set this repository as your dotfiles in [GitHub Codespaces settings](https://github.com/settings/codespaces).
YADM runs `bootstrap##os.Linux` which:
1. Downloads and installs tools: Neovim, ripgrep, bat, fzf, lazygit, mise, diff-so-fancy
2. Supports both amd64 and arm64 architectures
3. Installs mise-managed runtimes (node, copilot-language-server)
4. Keeps default Bash shell

### What Bootstrap Does

**macOS** (`bootstrap##os.Darwin`):
1. Installs Homebrew (if missing)
2. Runs `brew bundle --global` from `.Brewfile`
3. Sets Fish as default shell
4. Installs Fisher plugins

**Codespaces** (`bootstrap##os.Linux`):
1. Downloads latest tool releases via `gh` with architecture detection
2. Installs mise and configures runtimes
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

### Directory Structure

```
.
├── .config/
│   ├── nvim/           # Neovim (LazyVim)
│   ├── fish/           # Fish shell + functions
│   ├── git/            # Git config + ignore
│   ├── ghostty/        # Terminal emulator
│   ├── fzf/            # Fuzzy finder config
│   ├── mise/           # Runtime versions
│   ├── starship.toml   # Prompt config
│   └── yadm/           # Bootstrap scripts
├── .Brewfile           # Homebrew packages
├── .tmux.conf          # Tmux configuration
├── .pryrc              # Ruby REPL config
├── .gemrc              # RubyGems config
├── .rubocop.yml        # Ruby linter
└── script/
    ├── setup           # Initial setup script
    └── doctor          # Health check script
```

### OS-Specific Files

YADM uses alternate files with `##os.<OS>` suffix:
- `bootstrap##os.Darwin` - macOS bootstrap
- `bootstrap##os.Linux` - Linux bootstrap

## Key Configuration Details

### Neovim

- **Framework**: None — built directly on native Neovim using `vim.pack.add()` for plugin management (no LazyVim, no lazy.nvim)
- **Leader key**: `,` (comma)
- **Colorscheme**: Catppuccin (Mocha)
- **Theme consistency**: Catppuccin Mocha across Neovim, Tmux, and Ghostty

Layout:
- `init.lua` — declares all plugins via `vim.pack.add()` and configures them inline
- `plugin/` — auto-sourced runtime files (`options.lua`, `keymaps.lua`, `autocmds.lua`)
- `lsp/` — per-server config files loaded by `vim.lsp.enable()` (`gopls.lua`, `ruby_lsp.lua`, `vscode_sorbet.lua`)
- `ftplugin/`, `ftdetect/`, `after/` — filetype config and overrides
- `nvim-pack-lock.json` — pinned plugin versions managed by `vim.pack`

Notable options (`plugin/options.lua`):
- `number = true`, no relative numbers
- `gdefault = true` — substitutions replace all matches by default
- `clipboard = unnamedplus`, `laststatus = 3` (global statusline), `cmdheight = 0`
- Custom diagnostic signs/icons and a `CursorHold` autocmd that opens a focusless diagnostic float

Plugin set (all configured in `init.lua`):
- UI: `catppuccin/nvim`, `nvim-lualine/lualine.nvim`, `nvim-tree/nvim-web-devicons`, `folke/snacks.nvim` (notifier, statuscolumn, picker with vscode layout), `folke/which-key.nvim` (helix preset)
- Editing: `nvim-mini/mini.pairs`, `tpope/vim-surround`, `tpope/vim-repeat`, `tpope/vim-eunuch`, `gbprod/yanky.nvim` (shada-backed yank ring)
- Files: `justinmk/vim-dirvish` + `kristijanhusak/vim-dirvish-git`
- Treesitter: `nvim-treesitter/nvim-treesitter`, `rrethy/nvim-treesitter-endwise`
- LSP / completion: `neovim/nvim-lspconfig`, `folke/lazydev.nvim`, `saghen/blink.cmp` (1.x, enter preset, Tab/S-Tab navigation)
- Formatting: `stevearc/conform.nvim` — `format_on_save` with LSP fallback; `goimports`+`gofumpt` for Go, `stylua` for Lua

LSP servers enabled: `gopls`, `lua_ls`, `ruby_lsp`, `vscode_sorbet` (configs live in `lsp/`).

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
- `+x` → `chmod u+x`
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
- Default branch: main
- Key aliases: `co` (checkout with fzf), `cs` (commit --sign), `up` (pull --rebase)

### Tmux

- Prefix: `Ctrl-f`
- Base index: 1
- Copy mode: vim keybindings
- Theme: Catppuccin Mocha
- Plugins via TPM: pain-control, sensible, yank, catppuccin/tmux

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
