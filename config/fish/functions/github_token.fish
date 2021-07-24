function github_token
	# Check if there is a $GITHUB_TOKEN set
	if set -q GITHUB_TOKEN
		echo $GITHUB_TOKEN
		return 0
	end

	switch (uname)
		case "Darwin"
			set -gx GITHUB_TOKEN (_github_token_from_op)
			echo $GITHUB_TOKEN
		case '*'
			echo "A GITHUB_TOKEN could not be found not derived"
	end
end
