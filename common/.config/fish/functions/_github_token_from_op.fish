function _github_token_from_op
    switch (uname)
        case Darwin
            # Sign in to 1Password
            set session_token ""(op signin --raw)

            # Use the session token to find the GITHUB PAT in 1Password
            echo ""(op get item 'GitHub PAT' --session "$session_token" | jq -r '.details.sections[] | select(.fields).fields[].v | strings')
        case "*"
            echo "Not a Mac sorry!"
    end
end
