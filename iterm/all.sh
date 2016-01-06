#!/bin/sh

set -e

echo 'Overwriting iterm preferences'
rm -f ~/Library/Preferences/com.googlecode.iterm2.plist
ln -s $HOME/.dotfiles/iterm/com.googlecode.iterm2.plist ~/Library/Preferences/com.googlecode.iterm2.plist
