#!/bin/bash

set -e

if [[ $ZSH_NAME != "zsh" ]]; then
  echo "Changing Default Shell to ZSH"
  chsh -s /bin/zsh
fi

if test $PLATFORM == "osx"; then
  result=`brew --prefix autojump`
  if test -e "$result" ; then
    echo "autojump installed"
  else
    echo "install autojump - used by oh-my-zsh - with brew"
    brew install autojump
  fi
fi

# do I really want this, even?
# sh $HOME/.dotfiles/colors/base16-shell/base16-ocean.dark.sh
