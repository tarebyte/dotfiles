#!/bin/bash

if [ ! -f "$(brew --prefix chruby)" ]; then
  echo "chruby installed"
else
  echo "installing chruby"
  brew install chruby
fi
echo "done"

set -e

# shellcheck source=/dev/null
source "$(brew --prefix chruby)/share/chruby/chruby.sh"
chruby_reset

echo "Ruby root: $RUBY_ROOT"
echo "linking default gems for $(ruby -v)"

ln -sf "$PWD/ruby/default-gems" "$RUBY_ROOT/default-gems"
