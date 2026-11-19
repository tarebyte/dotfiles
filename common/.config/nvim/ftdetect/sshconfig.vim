" Per-host SSH config files and their starter template have no .conf suffix.
autocmd BufRead,BufNewFile ~/.ssh/config.d/*,*/templates/ssh-config.example setfiletype sshconfig
