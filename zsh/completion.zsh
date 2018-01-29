# matches case insensitive for lowercase
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# pasting with tabs doesn't perform completion
zstyle ':completion:*' insert-tab pending

# highlight the menu
zstyle ':completion:*' menu select

# Use the ls colors for the completion
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
