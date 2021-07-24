# Base16 Shell
if status --is-interactive
  set BASE16_SHELL "$HOME/.config/base16-shell/"
  source "$BASE16_SHELL/profile_helper.fish"
end

#######
# ENV #
#######

# These above all else.
set -g -x EDITOR nvim
set -g -x PROJECTS $HOME/src

set -g -x DOTFILES $PROJECTS/tarebyte/dotfiles
set -g -x FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -g -x FZF_CTRL_T_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -g -x FZF_TMUX 1
set -g -x GOPATH $PROJECTS/go
set -g -x OBJC_DISABLE_INITIALIZE_FORK_SAFETY YES

###########
# Aliases #
###########

alias brewup "brew update; brew doctor; brew outdated; brew upgrade; brew cleanup"

alias gp "git push"
alias gh-prepare "gh_prepare"

alias ls "ls -GpF"

alias mux "tmuxinator"

alias vi "nvim"
alias vim "nvim"

alias whereami "pwd"
alias +x "chmod +x"

#########
# PATHS #
#########

set -g fish_user_paths "/usr/local/sbin" $fish_user_paths
set -g fish_user_paths "/usr/local/opt/gnu-getopt/bin" $fish_user_paths
set -g fish_user_paths "/usr/local/opt/python@3.8/bin" $fish_user_paths
set -g fish_user_paths $DOTFILES/bin $fish_user_paths
set -g fish_user_paths $GOPATH/bin $fish_user_paths
set -g fish_user_paths ./bin $fish_user_paths

[ -f /usr/local/share/autojump/autojump.fish ]; and source /usr/local/share/autojump/autojump.fish

# Always attach to tmux
if which tmux 2>&1 >/dev/null
  if status is-interactive
    and not set -q TMUX
    tmux attach -t hack; or tmux new -s hack; and kill %self
 end
end
