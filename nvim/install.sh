#!/bin/sh

curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

nvim +PlugInstall +qa

pip2 install --upgrade pip
pip2 install neovim

pip3 install --upgrade pip
pip3 install neovim
