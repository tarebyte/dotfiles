#!/bin/bash

if test $PLATFORM == "osx"; then
  result=`/usr/local/bin/brew --prefix chruby`
  if test -e "$result"; then
    echo "chruby installed"
  else
    echo "installing chruby"
    brew install chruby
  fi
  # shellcheck source=/dev/null
  source "$(brew --prefix chruby)/share/chruby/chruby.sh"
  chruby_reset

  exit 0;
elif test "$PLATFORM" == "linux"; then
  exit 1;
else
  exit 1;
fi

set -e

echo "Ruby root: $RUBY_ROOT"
echo "linking default gems for $(ruby -v)"

# TODO: this was broken. probably dont need these anyway.
# ln -sf "$PWD/ruby/default-gems" "$RUBY_ROOT/default-gems"
