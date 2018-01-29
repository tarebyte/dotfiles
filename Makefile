HOME := $(subst $(notdir ${CURDIR}),,${CURDIR})
DOTFILES_ROOT := $(CURDIR)

all: osx tmux zsh nvim
.PHONY: tmux zsh nvim

osx:
	echo "osx"

brew:
	ln -fs $(DOTFILES_ROOT)/brew/Brewfile ${HOME}/.Brewfile
	brew bundle --global

zsh:
	echo "zsh"

tmux:
	echo "tmux"

git:
	ln -fs $(DOTFILES_ROOT)/git/.gitconfig ${HOME}/.gitconfig
	ln -fs $(DOTFILES_ROOT)/git/.gitignore ${HOME}/.gitignore

nvim:
	echo "nvim"

# bootstrap:
# 	echo "==> Bootstrapping"
# 	git submodule init && git submodule update
#
# zsh:
# 	$(info ==> Symlinking zshrc file)
# 	ln -fs $(CURDIR)/zsh/zshrc ${HOME}/.zshrc
#
# 	if test -z "$$ZSH_NAME"; then chsh -s /bin/zsh; fi
#
# 	$(info ==> Setting shell color scheme)
# 	sh $(DOTFILES_ROOT)/colors/base16-shell/base16-ocean.dark.sh
#
# elixir:
#
