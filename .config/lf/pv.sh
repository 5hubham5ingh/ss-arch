#!/bin/sh
file=$1
w=$2
h=$3
x=$4
y=$5
case "$1" in
    *.tar*) tar tf "$1";;
    *.zip) unzip -l "$1";;
    *.rar) unrar l "$1";;
    *.7z) 7z l "$1";;
    *.pdf) less "$1";;
    *.png) kitty +kitten icat --silent --stdin no --transfer-mode file --place "${w}x${h}@${x}x${y}" "$1" < /dev/null > /dev/tty ;;
    *.jpg) kitty +kitten icat --silent --stdin no --transfer-mode file --place "${w}x${h}@${x}x${y}" "$1" < /dev/null > /dev/tty ;;
    *.jpeg) kitty +kitten icat --silent --stdin no --transfer-mode file --place "${w}x${h}@${x}x${y}" "$1" < /dev/null > /dev/tty ;;
    *) unset COLORTERM; bat --wrap=auto --color=always --style=full --terminal-width "$((w-5))" "$1";;
esac

