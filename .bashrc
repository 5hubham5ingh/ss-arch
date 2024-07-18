#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias n='clear &&'

prompt='\n\033[0;1;36m- > '
dir='\033[0;1;36m\033[30;46m\W\033[0;1;36m'
user_and_host='\033[0;1;36m\033[30;46m\u\033[0;1;36m\033[0;1;36m\033[30;46m@\033[0;1;36m\033[0;1;36m\033[30;46m\h\033[0;1;36m'
info='\033[0;1;36m\033[30;46m\A\033[0;1;36m \033[30;46m\d\033[0;1;36m'
align_mid='\033[$(($(( (COLUMNS / 2) - 7 ))))C '
align_right='\033[$(($COLUMNS-21))C '
start='\033[1G'
up='\033[A'
down='\033[B'
lastLine='\033[9999;0H'
firstLine='\033[0;0H'
clear_screen='\033[2J'

PS1=$dir$start$align_mid$user_and_host$start$align_right$info$prompt

weather() {
  # TODO - impliment caching of weather data
  curl -s wttr.in | sed -n '8,17p'
}

inc_b() {
  ~/.scripts/increase_brightness.sh
}

dec_b() {
  ~/.scripts/decrease_brightness.sh
}

export city='kanpur'

export COLUMNS
