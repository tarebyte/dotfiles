# Base16 Shell
if status --is-interactive
  set BASE16_SHELL "$HOME/.config/base16-shell/"
  source "$BASE16_SHELL/profile_helper.fish"
end

switch (uname)
	case "Darwin"
		set -gx BREW_PREFIX (brew --prefix)
		set -U MACOS 1
	case "Linux"
		# I get some weird looking colors for directories under /workspaces
		if set -q CODESPACES
			set -gx LS_COLORS 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=01;04;30;40:ow=01;04;34;40:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:'
		end
end

#######
# ENV #
#######

set -gx EDITOR nvim
set -gx FZF_CTRL_T_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_DEFAULT_COMMAND "rg --files --hidden --follow --no-messages --glob '!.git/*'"
set -gx FZF_TMUX 1

if set -q CODESPACES
	set -gx PROJECTS /workspaces
	set -gx DOTFILES /workspaces/.codespaces/.persistedshare/dotfiles
else
	set -gx PROJECTS $HOME/src
	set -gx DOTFILES $PROJECTS/(whoami)/dotfiles
end

if set -q MACOS
	set -gx GOPATH $PROJECTS/go
	set -gx ITERM_ENABLE_SHELL_INTEGRATION_WITH_TMUX YES
	set -gx OBJC_DISABLE_INITIALIZE_FORK_SAFETY YES
	set -gx RUBY_CONFIGURE_OPTS "--with-openssl-dir="$BREW_PREFIX"/opt/openssl@1.1"
	set -gx TREE_SITTER_PARSER_DIR $BREW_PREFIX/bin/
end

# https://github.com/pure-fish/pure/wiki/Async-git-Prompt#async-git-prompt
set -g async_prompt_functions _pure_prompt_git

# https://github.com/pure-fish/pure#paintbrush-configuration
set --universal pure_color_git_branch green
set --universal pure_color_git_dirty pure_color_light

###########
# Aliases #
###########

alias brewup "brew update; brew doctor; brew outdated; brew upgrade; brew cleanup"

alias :e "nvim"

alias gp "git push"
alias gh-prepare "gh_prepare"

alias ls "ls -GpF"

alias mux "tmuxinator"

alias vi $EDITOR
alias vim $EDITOR

alias whereami "pwd"
alias +x "chmod +x"

if set -q MACOS
	alias emsdk_setup ". "$PROJECTS"/emscripten-core/emsdk/emsdk_env.fish"
end

####################
# Additional Paths #
####################

if set -q MACOS
	fish_add_path $GOPATH/bin
	fish_add_path $BREW_PREFIX/sbin
	fish_add_path "$BREW_PREFIX/opt/mysql@5.7/bin"
end

############
# Homebrew #
############

if set -q MACOS
	if test -d "$BREW_PREFIX/share/fish/completions"
		set -gx fish_complete_path $fish_complete_path $BREW_PREFIX/share/fish/completions
	end

	if test -d "$BREW_PREFIX/share/fish/vendor_completions.d"
		set -gx fish_complete_path $fish_complete_path $BREW_PREFIX/share/fish/vendor_completions.d
	end
else if test -d "/home/linuxbrew/.linuxbrew"
	set -gx HOMEBREW_PREFIX "/home/linuxbrew/.linuxbrew";
	set -gx HOMEBREW_CELLAR "/home/linuxbrew/.linuxbrew/Cellar";
	set -gx HOMEBREW_REPOSITORY "/home/linuxbrew/.linuxbrew/Homebrew";
	set -q PATH; or set PATH ''; set -gx PATH "/home/linuxbrew/.linuxbrew/bin" "/home/linuxbrew/.linuxbrew/sbin" $PATH;
	set -q MANPATH; or set MANPATH ''; set -gx MANPATH "/home/linuxbrew/.linuxbrew/share/man" $MANPATH;
	set -q INFOPATH; or set INFOPATH ''; set -gx INFOPATH "/home/linuxbrew/.linuxbrew/share/info" $INFOPATH;
end

############
# Autojump #
############

[ -f $BREW_PREFIX/share/autojump/autojump.fish ]; and source $BREW_PREFIX/share/autojump/autojump.fish

# Always attach to tmux
# See functions/hack.fish for deets
# hack
