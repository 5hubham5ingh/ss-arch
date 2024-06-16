#!/bin/bash
kitty @ set-font-size 12
curl -s wttr.in/kanpur | sed -n '8,17p'

echo " "
/home/ss/.scripts/js/sysInfo.llrt.js | lolcat -h 0 -v 6 -g 0286fa:02fa1f
