# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Personal dotfiles managed with **YADM** (Yet Another Dotfiles Manager). The repo is the home directory layout — files live at the paths they will be installed to (`.config/...`, `.tmux.conf`, `.Brewfile`, etc.). There is no build step; "deploying" a change means committing it and letting YADM sync it on the target machine.

YADM uses `##os.<OS>` suffixes to pick alternate files per platform. The two bootstrap scripts live at `.config/yadm/bootstrap##os.Darwin` (macOS) and `.config/yadm/bootstrap##os.Linux` (Codespaces / Linux), and YADM picks the right one automatically.

## Commands

There is no test suite, build, or linter for this repo. The relevant commands are:

| Command | Purpose |
|---------|---------|
| `script/setup` | First-time macOS setup: installs Homebrew, runs `brew bundle --global`, sets Fish as login shell, installs Fisher plugins. |
| `script/doctor` | Health check — verifies core tools, shell, git config, mise runtimes, Neovim, and tmux/TPM are present. Use this to validate changes. |
| `brew bundle --global` | Re-sync Homebrew packages after editing `.Brewfile`. |
| `yadm bootstrap` | Re-run the platform's bootstrap script. |
| `fisher update` | Update Fish plugins listed in `.config/fish/fish_plugins`. |
| `:h vim.pack` then `:lua vim.pack.update()` | Update Neovim plugins; commit the resulting `nvim-pack-lock.json`. |

When making changes that touch tooling, run `script/doctor` afterwards as the closest thing to a test.

## Architecture

### Two-platform split

The repo configures **two distinct shell environments** that share as much as possible:

- **macOS** → Fish (`.config/fish/config.fish`) + Starship prompt + Homebrew. Bootstrap installs Homebrew and a curated package set from `.Brewfile`.
- **Codespaces / Linux** → Bash (`.bash_aliases##os.Linux`) without Starship. Bootstrap downloads tool releases directly via `gh` (architecture-aware: amd64/arm64), since Homebrew isn't used there.

Both platforms share: `mise` for runtime versions, `EDITOR=nvim`, and the same core aliases (`lg`, `gp`, `vi`, `vim`). When adding a shell-level feature, consider whether it needs to be replicated in both `config.fish` and `.bash_aliases##os.Linux`.

Machine-specific secrets/overrides go in `.config/fish/local_env.fish` (gitignored; an `.example` file is checked in) or `.bash_aliases.local`.

### Neovim — native, no framework

**No LazyVim, no lazy.nvim, no Mason.** Built directly on native Neovim using `vim.pack.add()` for plugin management. Layout under `.config/nvim/`:

- `init.lua` — the whole config. Declares plugins via `vim.pack.add()` at the top, then configures each one inline below. Read this file first when changing anything plugin-related.
- `plugin/` — auto-sourced runtime files: `options.lua`, `keymaps.lua`, `autocmds.lua`, `commands.lua`. These load *after* `init.lua` finishes (see `:h load-plugins`, step 11 of startup), so they can safely `require()` plugins that were set up in `init.lua`.
- `lsp/` — per-server config files (`gopls.lua`, `lua_ls.lua`, `ruby_lsp.lua`, `vscode_sorbet.lua`) loaded via `vim.lsp.enable()` from `init.lua`. To add a server, drop a `<name>.lua` here and add it to the `vim.lsp.enable({...})` call.
- `ftplugin/`, `ftdetect/`, `after/` — standard Neovim filetype config and overrides.
- `nvim-pack-lock.json` — pinned plugin versions managed by `vim.pack`. Commit changes after updating plugins.

Key conventions:
- **Leader**: `,` (comma).
- `gdefault = true` and absolute (not relative) line numbers are intentional — don't "fix" them.
- `cmdheight = 0`, `laststatus = 3` (global statusline), `clipboard = unnamedplus`.
- Custom diagnostic float on `CursorHold` (focusless).
- All autocmds are wrapped in a named `augroup` with `clear = true` so re-sourcing any file is idempotent. New autocmds should follow the same pattern.
- Theme: Catppuccin Mocha, kept consistent with tmux.

Plugin set (all configured inline in `init.lua`):
- **UI**: `catppuccin/nvim`, `nvim-lualine/lualine.nvim`, `nvim-tree/nvim-web-devicons`, `folke/snacks.nvim` (notifier, statuscolumn, picker), `folke/which-key.nvim`.
- **Editing**: `nvim-mini/mini.pairs`, `tpope/vim-surround`, `tpope/vim-repeat`, `tpope/vim-eunuch`, `gbprod/yanky.nvim`, `ntpeters/vim-better-whitespace`.
- **Files / nav**: `justinmk/vim-dirvish` + `kristijanhusak/vim-dirvish-git`.
- **Treesitter**: `nvim-treesitter/nvim-treesitter` (+ `-context`, `-textobjects`, `rrethy/nvim-treesitter-endwise`).
- **LSP / completion**: `neovim/nvim-lspconfig`, `folke/lazydev.nvim`, `saghen/blink.cmp` (1.x).
- **Formatting**: `stevearc/conform.nvim` with `format_on_save` and LSP fallback (`goimports`+`gofumpt` for Go, `stylua` for Lua).
- **Rails**: `tpope/vim-rails`, `tpope/vim-projectionist`, `lewis6991/gitsigns.nvim`.

When adding a plugin: append a `gh("owner/repo")` entry to the `vim.pack.add({...})` block in `init.lua`, then add its `require(...).setup(...)` block further down. Run `:lua vim.pack.update()` and commit `nvim-pack-lock.json`.

### Fish shell

`.config/fish/` holds `config.fish`, `fish_plugins` (Fisher), and `functions/` (one function per file, filename must match function name). Notable functions: `gloan` (clones into `~/src/{owner}/{repo}`), `brewup`, `github_token` (pulls from 1Password). Key env vars set in `config.fish`: `PROJECTS=$HOME/src`, `DOTFILES=$PROJECTS/(whoami)/dotfiles`, `GOPATH=$PROJECTS/go`.

### Git, Tmux, terminal

- **Git** (`.config/git/config`): GPG signing on by default, `diff-so-fancy` pager, `pull.rebase`, default branch `main`. Aliases of note: `co` (fzf checkout), `cs` (signed commit), `up` (pull --rebase).
- **Tmux** (`.tmux.conf`): prefix `Ctrl-f`, base index 1, vim copy-mode keys, Catppuccin Mocha. Plugins managed by TPM (`prefix + I` to install).
- **Terminal emulator**: iTerm2 on macOS. Its config is **not tracked in this repo** — it changes too often to be worth maintaining. Don't try to edit iTerm2 settings here.

## Development Focus

Optimized primarily for **Ruby/Rails** work — Sorbet LSP (`vscode_sorbet`), ruby-lsp, Rubocop (`.rubocop.yml`), vim-rails, and pry aliases (`.pryrc`). Also configured for Go (gopls, gofumpt, goimports), Lua (lua_ls, stylua), Node, Rust, Python, and .NET via mise.
