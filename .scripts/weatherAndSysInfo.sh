#!/bin/bash

curl -s wttr.in | sed -n '8,17p'

/home/ss/.scripts/sysInfo.sh | lolcat -r
