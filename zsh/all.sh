#!/bin/sh

set -e

if [[ $ZSH_NAME != "zsh" ]]; then
  echo "Changing Default Shell to ZSH"
  chsh -s /bin/zsh
fi

echo "Setting shell color scheme"
sh $HOME/.dotfiles/colors/base16-shell/base16-ocean.dark.sh
