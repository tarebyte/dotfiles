# vim: ft=bash
# ~/.bash_aliases — Linux/Codespaces only (stowed from the `codespaces` package).
# Sourced automatically by bash.

# -------------------------
# Environment
# -------------------------
export EDITOR="nvim"
export VISUAL="nvim"
export BAT_THEME="ansi"
export PROJECTS="$HOME/src"

# DOTFILES resolves from this file's own real path — .bash_aliases is
# stowed from <repo>/codespaces/.bash_aliases, so two dirname levels
# above the resolved path is the repo root. Works whether the repo
# lives at ~/.dotfiles, ~/src/tarebyte/dotfiles, or wherever Codespaces
# cloned it.
_aliases_real=$(readlink -f "${BASH_SOURCE[0]}")
DOTFILES=$(dirname "$(dirname "$_aliases_real")")
export DOTFILES
unset _aliases_real

export FZF_DEFAULT_COMMAND="rg --files --hidden --follow --no-messages --glob '!.git/*'"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# -------------------------
# Path
# -------------------------
[[ -d "$HOME/.local/bin" ]] && export PATH="$HOME/.local/bin:$PATH"
[[ -d "$HOME/.bin" ]] && export PATH="$HOME/.bin:$PATH"

# -------------------------
# Aliases
# -------------------------
alias gp="git push"
alias gs="git status -sb"
alias gd="git diff"
alias gco="git checkout"
alias vi="nvim"
alias vim="nvim"
alias lg="lazygit"
alias ls="ls --color=auto -pF"
alias ll="ls -la"
alias la="ls -A"
alias ..="cd .."
alias ...="cd ../.."
alias tn="tmux new-session -A -s"
alias ':e'="$EDITOR"
alias '+x'="chmod u+x"
alias whereami="pwd"

# -------------------------
# Tool initialization
# -------------------------
command -v fzf &>/dev/null && eval "$(fzf --bash 2>/dev/null)" || true

# -------------------------
# Local overrides
# -------------------------
[[ -f "$HOME/.bash_aliases.local" ]] && source "$HOME/.bash_aliases.local"
