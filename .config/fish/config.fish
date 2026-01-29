# https://github.com/Homebrew/install/blob/abe5c4fe830cf6c36d1916b9eaac3ee818c949b8/uninstall.sh#L68-L73
switch (uname -m)
    case arm64
        set -gx HOMEBREW_PREFIX /opt/homebrew
    case "*"
        set -gx HOMEBREW_PREFIX /usr/local
end

############
# Homebrew #
############

if test -d $HOMEBREW_PREFIX
    set -gx HOMEBREW_CELLAR "$HOMEBREW_PREFIX/Cellar"
    set -gx HOMEBREW_REPOSITORY $HOMEBREW_PREFIX

    set -q PATH; or set PATH ''
    fish_add_path -gp "$HOMEBREW_PREFIX/bin" "$HOMEBREW_PREFIX/sbin"
    set -q MANPATH; or set MANPATH ''
    set -gx MANPATH "$HOMEBREW_PREFIX/share/man" $MANPATH
    set -q INFOPATH; or set INFOPATH ''
    set -gx INFOPATH "$HOMEBREW_PREFIX/share/info" $INFOPATH

    set -gx TREE_SITTER_PARSER_DIR $HOMEBREW_PREFIX/bin/

    # Autojump
    [ -f "$HOMEBREW_PREFIX/share/autojump/autojump.fish" ]; and source $HOMEBREW_PREFIX/share/autojump/autojump.fish
end

#######
# ENV #
#######

set -g async_prompt_functions _pure_prompt_git
set -gx BAT_THEME base16-256
set -gx EDITOR nvim

set -gx FZF_DEFAULT_OPTS_FILE $HOME/.config/fzf/config
set -gx FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_CTRL_T_COMMAND $FZF_DEFAULT_COMMAND
set -gx FZF_TMUX 1

set -gx ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX YES
set -gx OBJC_DISABLE_INITIALIZE_FORK_SAFETY YES

set -gx PROJECTS $HOME/src
set -gx DOTFILES $PROJECTS/(whoami)/dotfiles
set -gx GOPATH $PROJECTS/go

test -f "$HOME/.config/fish/local_env.fish"; and source $HOME/.config/fish/local_env.fish

####################
# Additional Paths #
####################

fish_add_path -aP $HOME/.bin

#####################
# Other adjustments #
#####################

set -U fish_greeting

##########################
# Aliases & Abbreviations #
##########################

abbr -ag gp git push
abbr -ag tn tmux new-session -A -s
abbr -ag lg lazygit
abbr -ag ":e" $EDITOR
abbr -ag "+x" "chmod u+x"
abbr -ag y yadm

alias ls "ls -GpF"
alias vi $EDITOR
alias vim $EDITOR
alias whereami pwd

if type -q starship
    starship init fish | source
end
