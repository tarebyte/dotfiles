#!/bin/bash
#
# install.sh
# Dotfiles installation for GitHub Codespaces
# https://docs.github.com/en/codespaces/setting-your-user-preferences/personalizing-github-codespaces-for-your-account#dotfiles
#

set -e

DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Installing dotfiles from $DOTFILES_DIR"

# -------------------------
# Symlink configurations
# -------------------------
link_file() {
  local src="$1"
  local dest="$2"

  if [[ -e "$src" ]]; then
    mkdir -p "$(dirname "$dest")"
    ln -sf "$src" "$dest"
    echo "  Linked: $dest"
  fi
}

echo "==> Linking config files..."

# Git
link_file "$DOTFILES_DIR/.config/git" "$HOME/.config/git"

# Neovim
link_file "$DOTFILES_DIR/.config/nvim" "$HOME/.config/nvim"

# Mise
link_file "$DOTFILES_DIR/.config/mise" "$HOME/.config/mise"

# fzf
link_file "$DOTFILES_DIR/.config/fzf" "$HOME/.config/fzf"

# Bash aliases (Codespaces sources this automatically)
link_file "$DOTFILES_DIR/.bash_aliases##os.Linux" "$HOME/.bash_aliases"

# Other dotfiles
link_file "$DOTFILES_DIR/.gemrc" "$HOME/.gemrc"
link_file "$DOTFILES_DIR/.pryrc" "$HOME/.pryrc"
link_file "$DOTFILES_DIR/.rubocop.yml" "$HOME/.rubocop.yml"
link_file "$DOTFILES_DIR/.tmux.conf" "$HOME/.tmux.conf"

# -------------------------
# Detect architecture
# -------------------------
ARCH=$(dpkg --print-architecture 2>/dev/null || echo "amd64")
case "$ARCH" in
  amd64) ARCH_ALT="x86_64" ; ARCH_GO="amd64" ; ARCH_TS="x64" ; ARCH_RG="x86_64" ;;
  arm64) ARCH_ALT="arm64" ; ARCH_GO="arm64" ; ARCH_TS="arm64" ; ARCH_RG="aarch64" ;;
  *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
esac

echo "==> Installing tools (arch: $ARCH)..."

# -------------------------
# Neovim
# -------------------------
if ! command -v nvim &>/dev/null; then
  echo "  Installing Neovim..."
  gh release download --clobber --dir /tmp/ --repo neovim/neovim --pattern "nvim-linux-${ARCH_ALT}.tar.gz"
  sudo tar -xzf /tmp/nvim-linux-${ARCH_ALT}.tar.gz -C /opt/
  sudo ln -sf /opt/nvim-linux-${ARCH_ALT}/bin/nvim /usr/local/bin/nvim
  rm -f /tmp/nvim-linux-${ARCH_ALT}.tar.gz
fi

# -------------------------
# ripgrep
# -------------------------
if ! command -v rg &>/dev/null; then
  echo "  Installing ripgrep..."
  gh release download --clobber --output /tmp/ripgrep.tar.gz --repo BurntSushi/ripgrep --pattern "ripgrep-*-${ARCH_RG}-unknown-linux-gnu.tar.gz"
  tar -xzf /tmp/ripgrep.tar.gz -C /tmp/
  sudo install /tmp/ripgrep-*/rg /usr/local/bin/rg
  rm -rf /tmp/ripgrep.tar.gz /tmp/ripgrep-*
fi

# -------------------------
# bat
# -------------------------
if ! command -v bat &>/dev/null; then
  echo "  Installing bat..."
  gh release download --clobber --output /tmp/bat.deb --repo sharkdp/bat --pattern "bat_*_${ARCH}.deb"
  sudo dpkg -i /tmp/bat.deb
  rm -f /tmp/bat.deb
fi

# -------------------------
# fzf
# -------------------------
if ! command -v fzf &>/dev/null; then
  echo "  Installing fzf..."
  gh release download --clobber --output /tmp/fzf.tar.gz --repo junegunn/fzf --pattern "fzf-*-linux_${ARCH_GO}.tar.gz"
  tar -xzf /tmp/fzf.tar.gz -C /tmp/
  sudo install /tmp/fzf /usr/local/bin/fzf
  rm -f /tmp/fzf.tar.gz /tmp/fzf
fi

# -------------------------
# lazygit
# -------------------------
if ! command -v lazygit &>/dev/null; then
  echo "  Installing lazygit..."
  gh release download --clobber --output /tmp/lazygit.tar.gz --repo jesseduffield/lazygit --pattern "lazygit_*_linux_${ARCH_ALT}.tar.gz"
  tar -xzf /tmp/lazygit.tar.gz -C /tmp/
  sudo install /tmp/lazygit /usr/local/bin/lazygit
  rm -f /tmp/lazygit.tar.gz /tmp/lazygit
fi

# -------------------------
# diff-so-fancy
# -------------------------
if ! command -v diff-so-fancy &>/dev/null; then
  echo "  Installing diff-so-fancy..."
  sudo curl -fsSL https://raw.githubusercontent.com/so-fancy/diff-so-fancy/master/diff-so-fancy -o /usr/local/bin/diff-so-fancy
  sudo chmod +x /usr/local/bin/diff-so-fancy
fi

# -------------------------
# mise
# -------------------------
if ! command -v mise &>/dev/null; then
  echo "  Installing mise..."
  curl -fsSL https://mise.run | sh
fi

# -------------------------
# tree-sitter
# -------------------------
if ! command -v tree-sitter &>/dev/null; then
  echo "  Installing tree-sitter..."
  gh release download --clobber --output /tmp/tree-sitter.gz --repo tree-sitter/tree-sitter --pattern "tree-sitter-linux-${ARCH_TS}.gz"
  gunzip -f /tmp/tree-sitter.gz
  sudo install /tmp/tree-sitter /usr/local/bin/tree-sitter
  rm -f /tmp/tree-sitter
fi

# -------------------------
# Done
# -------------------------
echo ""
echo "==> Done! Restart your terminal or run: source ~/.bash_aliases"
