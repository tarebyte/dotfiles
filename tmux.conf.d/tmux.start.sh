#!/bin/sh
#export PATH=$PATH:/usr/local/bin

# abort if we're already inside a TMUX session
[ "$TMUX" == "" ] || exit 0

# startup a "default" session if none currently exists
/opt/boxen/homebrew/bin/tmux has-session -t default || /opt/boxen/homebrew/bin/tmux new-session -s default -d

# present menu for user to choose which workspace to open
PS3="Please choose your session: "
options=($(/opt/boxen/homebrew/bin/tmux list-sessions -F "#S") "NEW SESSION")
echo "Available sessions"
echo "------------------"
echo " "
select opt in "${options[@]}"
do
  case $opt in
    "NEW SESSION")
      read -p "Enter new session name: " SESSION_NAME
      /opt/boxen/homebrew/bin/tmux new -s "$SESSION_NAME"
      break
      ;;
    *)
      /opt/boxen/homebrew/bin/tmux attach-session -t $opt
      break
      ;;
  esac
done
