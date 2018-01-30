#!/bin/sh
# Via https://git.io/vN9OU

config_dir=~/.config
config_file=$config_dir/fish/config.fish

mkdir -p $config_dir

if [ ! -f "$config_file" ]; then
  echo "No fish config found. Symlinking to dotfiles"
  ln -s ~/.dotfiles/fish "$config_dir"
fi

current_user=$(whoami)
fish_path=$(which fish)

#FIXME: Suppress the $fish_path from being outputted on the screen
grep -qF "fish" /etc/shells || echo $fish_path | sudo tee -a /etc/shells

sudo chsh -s $fish_path $current_user

unset current_user fish_path
