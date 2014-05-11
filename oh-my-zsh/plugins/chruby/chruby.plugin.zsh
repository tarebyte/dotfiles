#
# INSTRUCTIONS
#
#  With either a manual or brew installed chruby things should just work.
#
#  If you'd prefer to specify an explicit path to load chruby from
#  you can set variables like so:
#
#    zstyle :omz:plugins:chruby path /local/path/to/chruby.sh
#    zstyle :omz:plugins:chruby auto /local/path/to/auto.sh
#
# TODO
#  - autodetermine correct source path on non OS X systems
#  - completion if ruby-install exists

# rvm and rbenv plugins also provide this alias
alias rubies='chruby'

_homebrew-installed() {
    whence brew &> /dev/null
}

_chruby-from-homebrew-installed() {
    brew --prefix chruby &> /dev/null
}

_boxen-installed() {
    whence boxen &> /dev/null
}

_chruby-from-boxen-installed() {
  [ -d "/opt/boxen/chruby" ]
}
_ruby-build_installed() {
    whence ruby-build &> /dev/null
}

_ruby-install-installed() {
    whence ruby-install &> /dev/null
}

# Simple definition completer for ruby-build
if _ruby-build_installed; then
    _ruby-build() { compadd $(ruby-build --definitions) }
    compdef _ruby-build ruby-build
fi

_chruby_dirs() {
    chrubydirs=($HOME/.rubies/ $PREFIX/opt/rubies)
    for dir in chrubydirs; do
        if [[ -d $dir ]]; then
            RUBIES+=$dir
        fi
    done
}

if _boxen-installed && _chruby-from-boxen-installed; then
    source /opt/boxen/chruby/share/chruby/chruby.sh
    source /opt/boxen/chruby/share/chruby/auto.sh
    _chruby_dirs
elif _homebrew-installed && _chruby-from-homebrew-installed ; then
    source $(brew --prefix chruby)/share/chruby/chruby.sh
    source $(brew --prefix chruby)/share/chruby/auto.sh
    _chruby_dirs
elif [[ -r "/usr/local/share/chruby/chruby.sh" ]] ; then
    source /usr/local/share/chruby/chruby.sh
    source /usr/local/share/chruby/auto.sh
    _chruby_dirs
fi

function ensure_chruby() {
    $(whence chruby)
}

function current_ruby() {
    local _ruby
    _ruby="$(chruby |grep \* |tr -d '* ')"
    if [[ $(chruby |grep -c \*) -eq 1 ]]; then
        echo ${_ruby}
    else
        echo "system"
    fi
}

function chruby_prompt_info() {
    echo "$(current_ruby)"
}

# complete on installed rubies
_chruby() { compadd $(chruby | tr -d '* ') }
compdef _chruby chruby
