function refresh_github_token --description "Refresh the cached GITHUB_TOKEN from the gh keyring"
    # Cache path is also referenced by github_token and by the startup fast path
    # in ~/.config/fish/local_env.fish. Change it in all three.
    set -l cache $HOME/.cache/gh-token

    if not command -q gh
        echo "refresh_github_token: gh is not installed" >&2
        return 1
    end

    # `env -u` strips GH_TOKEN/GITHUB_TOKEN before calling gh. Tools like the
    # Copilot app inject their own narrowly-scoped token into the environment,
    # and `gh auth token` echoes that back when it's set. Unsetting it forces gh
    # to return the keyring credential, which is the one carrying read:packages.
    set -l token (env -u GH_TOKEN -u GITHUB_TOKEN gh auth token 2>/dev/null)

    if test -z "$token"
        echo "refresh_github_token: no keyring credential found" >&2
        echo "  run: gh auth login -s read:packages" >&2
        return 1
    end

    mkdir -p (dirname $cache)
    # Subshell so the umask applies only to creating the cache file.
    begin
        umask 077
        printf '%s\n' $token >$cache
    end

    set -gx GITHUB_TOKEN $token
end
