function set_github_token
    # Check if there is a $GITHUB_TOKEN set
    if set -q GITHUB_TOKEN
        echo "Set!"
        return 0
    end

    switch (uname)
        case Darwin
            # Retrieve the GitHub PAT from 1Password
            set -gx GITHUB_TOKEN (_github_token_from_op)

            echo "Set!"
        case '*'
            echo "A GITHUB_TOKEN could not be found not derived"
    end
end
