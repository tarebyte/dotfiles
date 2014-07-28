# Dotfiles

These are the files I tweak on almost a daily basis, it's a serious addiction.

Use these files in tandem with my [Boxen Config](https://github.com/tarebyte/my-boxen)

## install
3ish Easy steps:

```
git clone https://github.com/tarebyte/dotfile ~/.dotfiles
cd ~/.dotfiles
script/bootstrap

# If you aren't using My Boxen
chsh -s /bin/zsh
```

And that's it! This will symlink any .symlink file into your home directory

## thanks

I used [Zach Holman's](http://zachholman.com/) awesome [dotfiles](https://github.com/holman/dotfiles)
as a template to build my own.

I pulled a lot of functionality out of the [Neo vim-config](https://github.com/neo/vim-config)
and [Jason Long's](http://www.jasonlong.me/) [vimrc](https://github.com/jasonlong/dotfiles/blob/master/vimrc)
