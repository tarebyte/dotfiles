#!/bin/bash

set -e

ln -sf "$PWD/ruby/default-gems" "$(rbenv root)/default-gems"
