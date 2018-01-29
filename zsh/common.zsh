function colours() {
  for i in {0..255} ; do
    printf "\x1b[38;5;${i}mcolour${i}\n"
  done
}

function trash() { mv $1 ~/.Trash }

# find shorthand
function f() {
  find . -name "$1"
}
