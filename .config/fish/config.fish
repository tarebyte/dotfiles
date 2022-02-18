switch (uname)
  case "Darwin"
    set -gx ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX YES
    set -gx OBJC_DISABLE_INITIALIZE_FORK_SAFETY YES

    # https://github.com/Homebrew/install/blob/abe5c4fe830cf6c36d1916b9eaac3ee818c949b8/uninstall.sh#L68-L73
    switch (uname -m)
      case "arm64"
        set -gx HOMEBREW_PREFIX "/opt/homebrew"
      case "*"
        set -gx HOMEBREW_PREFIX "/usr/local"
    end

    set -gx RUBY_CONFIGURE_OPTS "--with-openssl-dir="$HOMEBREW_PREFIX"/opt/openssl@1.1"
    set -gx TREE_SITTER_PARSER_DIR $HOMEBREW_PREFIX/bin/

    alias ls "ls -GpF"
  case "Linux"
    set -gx HOMEBREW_PREFIX "/home/linuxbrew/.linuxbrew"

    set -gx LS_COLORS 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=01;04;30;40:ow=01;04;34;40:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:'
    set -gx LS_OPTIONS --color=auto

    alias ls "ls -GpF $LS_OPTIONS"

    # Don't show my container status if I'm SSH'd into a Codespace.
    if set -q CODESPACES; and test "$SSH_CONNECTION" != ""
      alias _pure_is_inside_container false
    end
end

############
# Homebrew #
############

if test -d $HOMEBREW_PREFIX
  set -gx HOMEBREW_CELLAR "$HOMEBREW_PREFIX/Cellar";
  set -gx HOMEBREW_REPOSITORY $HOMEBREW_PREFIX;

  set -q PATH;     or set PATH      ''; set -gx PATH     "$HOMEBREW_PREFIX/bin" "$HOMEBREW_PREFIX/sbin" $PATH;
  set -q MANPATH;  or set MANPATH   ''; set -gx MANPATH  "$HOMEBREW_PREFIX/share/man" $MANPATH;
  set -q INFOPATH; or set INFOPATH  ''; set -gx INFOPATH "$HOMEBREW_PREFIX/share/info" $INFOPATH;

  if test -d $HOMEBREW_PREFIX/share/fish/completions
    set -gx fish_complete_path $fish_complete_path $HOMEBREW_PREFIX/share/fish/completions
  end

  if test -d $HOMEBREW_PREFIX/share/fish/vendor_completions.d
    set -gx fish_complete_path $fish_complete_path $HOMEBREW_PREFIX/share/fish/vendor_completions.d
  end

  # Autojump
  [ -f "$HOMEBREW_PREFIX/share/autojump/autojump.fish" ]; and source $HOMEBREW_PREFIX/share/autojump/autojump.fish

  # ASDF
  source $HOMEBREW_PREFIX/opt/asdf/libexec/asdf.fish
end

#######
# ENV #
#######

set -gx BAT_THEME "base16-256"
set -gx EDITOR nvim
set -gx FZF_DEFAULT_OPTS "--height 40% --border"
set -gx FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_CTRL_T_COMMAND $FZF_DEFAULT_COMMAND
set -gx FZF_TMUX 1

if set -q CODESPACES
  set -gx PROJECTS /workspaces
  set -gx DOTFILES /workspaces/.codespaces/.persistedshare/dotfiles
  set -gx GOPATH $HOME/go
else
  set -gx PROJECTS $HOME/src
  set -gx DOTFILES $PROJECTS/(whoami)/dotfiles
  set -gx GOPATH $PROJECTS/go
end

####################
# Additional Paths #
####################

fish_add_path -aP $HOME/.bin
fish_add_path -aP $GOPATH/bin

#####################
# Other adjustments #
#####################

set -U fish_greeting

###########
# Aliases #
###########

alias brewup "brew update; brew doctor; brew outdated; brew upgrade; brew cleanup"

alias gh-prepare "gh_prepare"

alias vi $EDITOR
alias vim $EDITOR

alias whereami "pwd"

#################
# Abbreviations #
#################

abbr -ag gp git push
abbr -ag mux tmuxinator
abbr -ag tn tmux new-session -A -s
abbr -ag ":e" $EDITOR
abbr -ag "+x" "chmod u+x"

##########################
# Must be at the bottom! #
##########################

starship init fish | source
