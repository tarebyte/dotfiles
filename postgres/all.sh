#!/bin/bash

if test $PLATFORM == "osx"; then
  result=`brew --prefix postgresql`
  if test -e "$result"; then
    echo "postgresql installed"
  else
    echo "installing postgresql"
    brew install postgresql
    ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
  fi
elif test "$PLATFORM" == "linux"; then
  exit 1;
else
  exit 1;
fi

exit 0;
