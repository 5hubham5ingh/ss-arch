#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias n='clear &&'

# Colours
foreground_color='\033[0;1;36m'
command_foreground='\033[0m'
background_color_black='\033[30m'
background_color_cyan='\033[46m'

# Cursor
start='\033[1G'
align_mid='\033[$(( (COLUMNS / 2) - 9 ))C'
align_right='\033[$(($COLUMNS-21))C'
up='\033[A'
down='\033[B'
lastLine='\033[9999;0H'
firstLine='\033[0;0H'
clear_screen='\033[2J'

# Prompt components
prompt="\n${foreground_color}--> ${command_foreground}"
dir="${foreground_color}${background_color_black}${background_color_cyan}\W${foreground_color}"
user_and_host="${foreground_color}${background_color_black}${background_color_cyan}\u${foreground_color}${foreground_color}${background_color_black}${background_color_cyan}@${foreground_color}${foreground_color}${background_color_black}${background_color_cyan}\h${foreground_color}"
info="${foreground_color}${background_color_black}${background_color_cyan}\A${foreground_color} ${foreground_color}${background_color_black}${background_color_cyan}\d${foreground_color}"

# Prompt string
PS1="${dir}${start}${align_mid}${user_and_host}${start}${align_right}${info}${prompt}"

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

export PATH=$PATH:/home/ss/.local/bin

eval "$(zoxide init bash)"
