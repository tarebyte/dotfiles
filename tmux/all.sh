#!/bin/bash
set -e

if test $PLATFORM == "osx"; then
  result=`brew --prefix tmux`
  if test -e "$result" ; then
    echo "tmux installed"
  else
    echo "install tmux with brew"
    brew install tmux
  fi
elif test "$PLATFORM" == "linux"; then
  exit 1;
else
  exit 1;
fi

