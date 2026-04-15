UNAME := $(shell uname -s)

.DEFAULT_GOAL := install

# Every target in this file is phony — all real work lives in script/
# and this Makefile is just a dispatcher. If you add a new target,
# list it in .PHONY below.
.PHONY: install install-darwin install-codespaces stow-common
.PHONY: setup-git-config regen-git-config
.PHONY: brew fisher mise doctor clean

# Dispatcher is explicitly serial. Parallel `make -j` on overlapping stow
# packages would race during directory folding, and none of this benefits
# from parallelism anyway.
.NOTPARALLEL:

# Platform-conditional prerequisites, composed at parse time. Under
# .NOTPARALLEL, prerequisites run left-to-right in the order listed,
# so `install`'s chain is: setup-git-config → stow-common → extras.
EXTRA_INSTALL :=
ifeq ($(UNAME),Darwin)
EXTRA_INSTALL += install-darwin
endif
ifneq ($(CODESPACES),)
EXTRA_INSTALL += install-codespaces
endif

install: setup-git-config stow-common $(EXTRA_INSTALL)

stow-common:
	stow -t $$HOME common

# Assumes setup-git-config + stow-common have already run (i.e. was
# invoked via `make install`). Safe to re-run as a standalone repair
# workflow — the script is idempotent.
install-darwin:
	./script/install-darwin

# Assumes setup-git-config has already run. Stows the codespaces
# package and runs the tool installer.
install-codespaces:
	stow -t $$HOME codespaces
	./script/install-codespace-tools

# Render templates/git-config.tmpl into ~/.config/git/config. Prompts
# for identity on first run; silent thereafter. See the script for
# details.
setup-git-config:
	./script/setup-git-config

regen-git-config: setup-git-config

brew:
	brew bundle --global

# Bootstrap fisher if missing, then update plugins. Matches the old
# run_onchange_after_30-fisher-update.sh.tmpl. No-op if fish is absent.
fisher:
	@if command -v fish >/dev/null 2>&1; then \
		fish -c 'curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher && fisher update'; \
	else \
		echo "fish not on PATH; skipping"; \
	fi

# Trust mise config and install all runtimes. No-op if mise is absent.
# The guard must be a single if/then/else: an `|| { exit 0; }` on a
# separate recipe line only exits the subshell, and Make proceeds to
# the next line and fails.
mise:
	@if command -v mise >/dev/null 2>&1; then \
		mise trust && mise install; \
	else \
		echo "mise not on PATH; skipping"; \
	fi

doctor:
	./script/doctor

# Uninstall all stowed packages from $HOME. Does NOT delete the repo,
# the generated ~/.config/git/config, or ~/.config/dotfiles/identity.env.
# Leading `-` tolerates `stow -D` on a package that wasn't previously
# stowed (modern stow is a no-op in that case, but older versions and
# some edge cases error).
clean:
	-stow -D -t $$HOME common
ifeq ($(UNAME),Darwin)
	-stow -D -t $$HOME darwin
endif
ifneq ($(CODESPACES),)
	-stow -D -t $$HOME codespaces
endif
