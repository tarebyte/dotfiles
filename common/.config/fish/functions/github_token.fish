function github_token --description "Print a GitHub token, from the environment or the gh keyring cache"
    if set -q GITHUB_TOKEN; and test -n "$GITHUB_TOKEN"
        echo $GITHUB_TOKEN
        return 0
    end

    # Cache path is also referenced by refresh_github_token and by the startup
    # fast path in ~/.config/fish/local_env.fish. Change it in all three.
    set -l cache $HOME/.cache/gh-token

    # Reuse the cache for a week, then fall through to a refresh so a rotated
    # token doesn't go stale indefinitely.
    if test -r $cache; and test (path mtime -R $cache) -lt 604800
        read --local --line cached <$cache
        if test -n "$cached"
            echo $cached
            return 0
        end
    end

    refresh_github_token; or return 1
    echo $GITHUB_TOKEN
end
