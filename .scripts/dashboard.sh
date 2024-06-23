#!/usr/bin/env bash

curl -s wttr.in/kanpur | sed -n '8,17p'
echo " "
/home/ss/.scripts/js/sysInfo.llrt.js | lolcat -h 0 -v 6 -g 0286fa:02fa1f &
kitty @ launch --type=window --location=vsplit btop -p 1 >>/dev/null

kitty @ resize-window --self -i 23

kitty @ launch --type=window --location=hsplit btop -p 2 >>/dev/null
kitty @ resize-window -a vertical -i -6

kitty @ focus-window
kitty @ launch --type=window --location=hsplit >>/dev/null
kitty @ resize-window -a vertical -i 5

kitty @ scroll-window start
kitty @ set-font-size 12
