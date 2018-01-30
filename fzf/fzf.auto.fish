source "/usr/local/opt/fzf/shell/key-bindings.fish"

set -gx FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_CTRL_T_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
