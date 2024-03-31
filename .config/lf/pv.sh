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
    *.png) kitty icat --place "${w}x${h}@${x}x${y}" "$1" ;;
    *.jpg)  kitty icat --place "${w}x${h}@${x}x${y}" "$1" ;;
    *.jpeg) kitty icat --place "${w}x${h}@${x}x${y}" "$1" ;;
    *)  unset COLORTERM; bat --wrap=auto --color=always --style=full "$1";;
esac

