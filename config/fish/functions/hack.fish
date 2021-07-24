function hack
	if which tmux 2>&1 >/dev/null
		if status is-interactive
			and not set -q TMUX
			tmux attach -t hack; or tmux new -s hack; and kill %self
		end
	end
end
