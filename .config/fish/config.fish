switch (uname)
    case Darwin
        set -gx ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX YES
        set -gx OBJC_DISABLE_INITIALIZE_FORK_SAFETY YES

        # https://github.com/Homebrew/install/blob/abe5c4fe830cf6c36d1916b9eaac3ee818c949b8/uninstall.sh#L68-L73
        switch (uname -m)
            case arm64
                set -gx HOMEBREW_PREFIX /opt/homebrew
            case "*"
                set -gx HOMEBREW_PREFIX /usr/local
        end

        set -gx RUBY_CONFIGURE_OPTS "--with-openssl-dir="$HOMEBREW_PREFIX"/opt/openssl@1.1"
        set -gx TREE_SITTER_PARSER_DIR $HOMEBREW_PREFIX/bin/

        alias ls "ls -GpF"
    case Linux
        set -gx HOMEBREW_PREFIX "/home/linuxbrew/.linuxbrew"

        # https://github.com/arcticicestudio/nord-dircolors/blob/e512d31c934e4dccd1f5b634dd2c5b8c632c6e25/src/dir_colors
        set -gx LS_COLORS 'no=00:rs=0:fi=00:di=01;34:ln=36:mh=04;36:pi=04;01;36:so=04;33:do=04;01;36:bd=01;33:cd=33:or=31:mi=01;37;41:ex=01;36:su=01;04;37:sg=01;04;37:ca=01;37:tw=01;37;44:ow=01;04;34:st=04;37;44:*.7z=01;32:*.ace=01;32:*.alz=01;32:*.arc=01;32:*.arj=01;32:*.bz=01;32:*.bz2=01;32:*.cab=01;32:*.cpio=01;32:*.deb=01;32:*.dz=01;32:*.ear=01;32:*.gz=01;32:*.jar=01;32:*.lha=01;32:*.lrz=01;32:*.lz=01;32:*.lz4=01;32:*.lzh=01;32:*.lzma=01;32:*.lzo=01;32:*.rar=01;32:*.rpm=01;32:*.rz=01;32:*.sar=01;32:*.t7z=01;32:*.tar=01;32:*.taz=01;32:*.tbz=01;32:*.tbz2=01;32:*.tgz=01;32:*.tlz=01;32:*.txz=01;32:*.tz=01;32:*.tzo=01;32:*.tzst=01;32:*.war=01;32:*.xz=01;32:*.z=01;32:*.Z=01;32:*.zip=01;32:*.zoo=01;32:*.zst=01;32:*.aac=32:*.au=32:*.flac=32:*.m4a=32:*.mid=32:*.midi=32:*.mka=32:*.mp3=32:*.mpa=32:*.mpeg=32:*.mpg=32:*.ogg=32:*.opus=32:*.ra=32:*.wav=32:*.3des=01;35:*.aes=01;35:*.gpg=01;35:*.pgp=01;35:*.doc=32:*.docx=32:*.dot=32:*.odg=32:*.odp=32:*.ods=32:*.odt=32:*.otg=32:*.otp=32:*.ots=32:*.ott=32:*.pdf=32:*.ppt=32:*.pptx=32:*.xls=32:*.xlsx=32:*.app=01;36:*.bat=01;36:*.btm=01;36:*.cmd=01;36:*.com=01;36:*.exe=01;36:*.reg=01;36:*~=02;37:*.bak=02;37:*.BAK=02;37:*.log=02;37:*.log=02;37:*.old=02;37:*.OLD=02;37:*.orig=02;37:*.ORIG=02;37:*.swo=02;37:*.swp=02;37:*.bmp=32:*.cgm=32:*.dl=32:*.dvi=32:*.emf=32:*.eps=32:*.gif=32:*.jpeg=32:*.jpg=32:*.JPG=32:*.mng=32:*.pbm=32:*.pcx=32:*.pgm=32:*.png=32:*.PNG=32:*.ppm=32:*.pps=32:*.ppsx=32:*.ps=32:*.svg=32:*.svgz=32:*.tga=32:*.tif=32:*.tiff=32:*.xbm=32:*.xcf=32:*.xpm=32:*.xwd=32:*.xwd=32:*.yuv=32:*.anx=32:*.asf=32:*.avi=32:*.axv=32:*.flc=32:*.fli=32:*.flv=32:*.gl=32:*.m2v=32:*.m4v=32:*.mkv=32:*.mov=32:*.MOV=32:*.mp4=32:*.mpeg=32:*.mpg=32:*.nuv=32:*.ogm=32:*.ogv=32:*.ogx=32:*.qt=32:*.rm=32:*.rmvb=32:*.swf=32:*.vob=32:*.webm=32:*.wmv=32:'
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
    set -gx HOMEBREW_CELLAR "$HOMEBREW_PREFIX/Cellar"
    set -gx HOMEBREW_REPOSITORY $HOMEBREW_PREFIX

    set -q PATH; or set PATH '';

    if type -q fish_add_path
        fish_add_path -gp "$HOMEBREW_PREFIX/bin" "$HOMEBREW_PREFIX/sbin"
    else
        if not contains "$HOMEBREW_PREFIX/bin" $PATH
            set -gx PATH "$HOMEBREW_PREFIX/bin" "$HOMEBREW_PREFIX/sbin" $PATH
        end
    end

    set -q MANPATH; or set MANPATH ''; set -gx MANPATH "$HOMEBREW_PREFIX/share/man" $MANPATH;
    set -q INFOPATH; or set INFOPATH ''; set -gx INFOPATH "$HOMEBREW_PREFIX/share/info" $INFOPATH;

    # Inside of a Codespace we're using the image provided fish which is not
    # installed via Homebrew.
    if set -q CODESPACES
        if test -d "$HOMEBREW_PREFIX/share/fish/completions"
            set -gx fish_complete_path $fish_complete_path $HOMEBREW_PREFIX/share/fish/completions
        end

        if test -d "$HOMEBREW_PREFIX/share/fish/vendor_completions.d"
            set -gx fish_complete_path $fish_complete_path $HOMEBREW_PREFIX/share/fish/vendor_completions.d
        end
    end

    # Autojump
    [ -f "$HOMEBREW_PREFIX/share/autojump/autojump.fish" ]; and source $HOMEBREW_PREFIX/share/autojump/autojump.fish
end

################
# Language ENV #
################

if status --is-interactive
    if command -q nodenv
        source (nodenv init - | psub)
    end

    if command -q rbenv
        rbenv init - fish | source
    end
end

#######
# ENV #
#######

set -g async_prompt_functions _pure_prompt_git
set -gx BAT_THEME base16-256
set -gx EDITOR nvim
set -gx FZF_DEFAULT_OPTS "--height 40% --border"
set -gx FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_CTRL_T_COMMAND $FZF_DEFAULT_COMMAND
set -gx FZF_TMUX 1

if set -q CODESPACES
    set -gx PROJECTS /workspaces
    set -gx DOTFILES /workspaces/.codespaces/.persistedshare/dotfiles
    set -gx RUBY_DEBUG 1
else
    set -gx PROJECTS $HOME/src
    set -gx DOTFILES $PROJECTS/(whoami)/dotfiles
    set -gx GOPATH $PROJECTS/go
end

####################
# Additional Paths #
####################

if type -q fish_add_path
    fish_add_path -aP $HOME/.bin
else
    if not contains "$HOME/.bin" $PATH
        set -gx PATH $PATH $HOME/.bin
    end
end

#####################
# Other adjustments #
#####################

set -U fish_greeting

###########
# Aliases #
###########

alias gh-prepare gh_prepare

alias vi $EDITOR
alias vim $EDITOR

alias whereami pwd

#################
# Abbreviations #
#################

abbr -ag gp git push
abbr -ag mux tmuxinator
abbr -ag tn tmux new-session -A -s
abbr -ag lg lazygit
abbr -ag ":e" $EDITOR
abbr -ag "+x" "chmod u+x"
