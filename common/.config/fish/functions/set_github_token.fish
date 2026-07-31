function set_github_token --description "Export GITHUB_TOKEN into the current shell"
    if set -q GITHUB_TOKEN; and test -n "$GITHUB_TOKEN"
        echo "Set!"
        return 0
    end

    set -l token (github_token); or return 1

    set -gx GITHUB_TOKEN $token
    echo "Set!"
end
