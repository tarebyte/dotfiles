#!/bin/sh

set -e

echo "Installing neobundle"

if [ ! -d "$HOME/.vim/bundle" ]; then
  mkdir -p ~/.vim/bundle
fi

if [ ! -d "$HOME/.vim/bundle/neobundle.vim" ]; then
  git clone https://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim
fi
