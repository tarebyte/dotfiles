#!/bin/bash

set -e

bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)

source $HOME/.gvm/scripts/gvm

# In order to install Go 1.5+ we have to install the Go 1.4 binary see
# https://github.com/moovweb/gvm#a-note-on-compiling-go-15
gvm install go1.4 -B
gvm use go1.4
export GOROOT_BOOTSTRAP=$GOROOT
gvm install go1.5
