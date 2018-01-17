#!/bin/sh

brew install neovim

curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

nvim +PlugInstall +qa

python3 -m pip install --upgrade pip
python3 -m pip install neovim
