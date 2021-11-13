####################
# Additional Paths #
####################

if set -q CODESPACES
	set -gx fish_user_paths $fish_user_paths $DOTFILES/bin
	set -gx fish_user_paths $fish_user_paths $GOPATH/bin
	set -gx fish_user_paths $fish_user_paths $PROJECTS/$Repositoryname/bin
else
	# I have no idea why this is missing
	fish_add_path $DOTFILES/bin
	fish_add_path $GOPATH/bin
end
