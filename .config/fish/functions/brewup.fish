function brewup -d "Bring all of the homebrew packages up to speed"
    brew update; brew doctor; brew outdated; brew upgrade; brew cleanup
end
