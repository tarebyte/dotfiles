#!/bin/bash

#TODO this has a dependency on python3 which should be automated
if test $PLATFORM == "osx"; then
  result=`/usr/local/bin/brew --prefix neovim`
  if test -e "$result" ; then
    echo "neovim installed"
  else
    echo "install neovim with brew"
    brew install neovim

    echo "install vim plugins"
    curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
      https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

    nvim +PlugInstall +qa

    python3 -m pip install --upgrade pip
    python3 -m pip install neovim
  fi
elif test "$PLATFORM" == "linux"; then
  exit 1;
else
  exit 1;
fi

exit 0;
