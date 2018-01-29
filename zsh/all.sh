#!/bin/bash

set -e

if [[ $ZSH_NAME != "zsh" ]]; then
  echo "Changing Default Shell to ZSH"
  chsh -s /bin/zsh
fi

# TODO: this path is wrong. I think this has been broken
# for a while. does anything use colors?
# sh $HOME/.dotfiles/colors/base16-shell/base16-ocean.dark.sh
