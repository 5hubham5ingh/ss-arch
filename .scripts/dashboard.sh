#!/usr/bin/env bash

kitty @ launch --type=window --location=vsplit btop -p 1 >>/dev/null

kitty @ resize-window --self -i 23

kitty @ launch --type=window --location=hsplit btop -p 2 >>/dev/null
kitty @ resize-window -a vertical -i -10
kitty @ resize-window -a vertical -i 10
kitty @ focus-window
kitty @ launch --type=window --location=hsplit >>/dev/null
kitty @ resize-window -a vertical -i 6

kitty @ set-font-size 12

(
	(
		weather=$(curl -s wttr.in/kanpur | sed -n '8,17p')
		echo -e "$weather" &&
			/home/ss/.scripts/js/sysInfo.llrt.js | lolcat -h 0 -v 6 -g 0286fa:02fa1f
	) &&
		kitty @ scroll-window 2-
)
