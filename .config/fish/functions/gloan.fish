# Ported from https://gist.github.com/searls/62d5cb2f736a75c73ae2
#
# A simple script to keep a tidy ~/src directory organized by owner & then repo
# When the script is done, just hit command-v to switch into the directory
# (GitHub and Mac only. Sorry, openness!)
#
# Usage:
#   gloan <owner>/<repo>
#
# example: gloan testdouble/testdouble.js
#
# Once cloned, will copy a "cd" command to quickly change into repo directory

function gloan
	set src_dir $PROJECTS
	set nwo $argv[1]

	if test -z "$nwo"
		echo "Repository name with owner is missing"
		return 1
	end

	echo $nwo | read -d / owner repo

	set owner_dir "$src_dir/$owner"
	set repo_dir "$owner_dir/$repo"

	# Make sure owner directory exists
	mkdir -p "$owner_dir"

	# Make sure it's not already cloned, then clone
	if test -d "$repo_dir"
	  echo "It looks like the repo was already cloned."
	else
		git clone "git@github.com:$owner/$repo.git" "$repo_dir"
	end

	printf "cd %s/%s/%s" "$src_dir" "$owner" "$repo" | pbcopy
	echo "Hit Command-V to cd into the repo!"
end
