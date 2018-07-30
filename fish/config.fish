# A workaround for Fish re-reading config for non-interactive execution:
# https://git.io/yj4KoA
if not status --is-interactive
  exit
end

set dotfiles_path "$HOME/.dotfiles"

# Set the colors before anything else
if status --is-interactive
    set BASE16_SHELL "$dotfiles_path/colors/base16-shell/"
    source "$BASE16_SHELL/profile_helper.fish"
end

# Autoload any files that update the $PATH first
for file in $dotfiles_path/**/path.fish
  source $file
end

# Autoload any files that end in .auto.fish
for file in $dotfiles_path/**/*.auto.fish
  source $file
end

# Autoload any files that end in auto.sh
for file in $dotfiles_path/**/*.auto.sh
  sh $file
end

# Always attach to tmux
if which tmux 2>&1 >/dev/null
  if status is-interactive
  and not set -q TMUX
    tmux attach -t hack; or tmux new -s hash; and kill %self
  end
end
