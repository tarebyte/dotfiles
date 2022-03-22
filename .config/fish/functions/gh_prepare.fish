function _center -a total_length prefix center suffix
    set center_length (string length $center)

    set padding_length (math floor \(\($total_length - $center_length\) / 2\))
    set prefix $prefix(string repeat -n $padding_length ' ')
    set suffix (string repeat -n $padding_length ' ')$suffix

    echo -e "$prefix$center$suffix"
end

function _gh_prepare_message -a message
    echo -e "\n"(_center 49 "🚧" $message "🚧")
    echo -e "======================================================\n"
end

# Don't work at GitHub? This won't do you much good.
function gh_prepare -d "Update github/github"
    _gh_prepare_message "Jumping to GitHub!"

    if set -q CODESPACES
        set github_path "$PROJECTS/github"
    else
        set github_path "$PROJECTS/github/github"
    end

    cd $github_path || exit 1

    if test ! -e $github_path/config/projections.json
        _gh_prepare_message "Setting projections.json..."

        set gist_id d7625fa8f22eb48c25937f890064b63a

        if test ! -d /tmp/$gist_id
            _gh_prepare_message "Pulling projections.json from Gist..."
            git clone https://gist.github.com/$gist_id.git /tmp/$gist_id
        else
            _gh_prepare_message "Updating projections.json from Gist..."
            cd /tmp/$gist_id; and git pull origin master
        end

        cp /tmp/$gist_id/projections.json $github_path/config/projections.json
    end

    _gh_prepare_message "Gitting ready..."
    git up

    _gh_prepare_message "Bootstrapping..."
    ./script/bootstrap

    _gh_prepare_message "Migrating the databases..."
    ./bin/rake db:migrate db:test:prepare

    _gh_prepare_message "Updating Ctags..."
    ./bin/build-ctags
end
