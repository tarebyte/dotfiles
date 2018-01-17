#!/bin/bash

# sets $RUBY_ROOT and adds rubies to path.
brew install chruby
chruby 2.5.0

set -e

ln -sf "$PWD/ruby/default-gems" "$RUBY_ROOT/default-gems"
