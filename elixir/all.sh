#!/bin/bash

if test $PLATFORM == "osx"; then
  result=`/usr/local/bin/brew --prefix elixir`
  if test -e "$result"; then
    echo "elixir installed"
  else
    echo "installing elixir"
    brew install elixir
    mix local.hex
    mix archive.install https://github.com/phoenixframework/archives/raw/master/phx_new.ez
  fi
  exit 0;
elif test "$PLATFORM" == "linux"; then
  exit 1;
else
  exit 1;
fi

