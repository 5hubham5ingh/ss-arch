#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
alias yz='yazi'
alias grep='grep --color=auto'
alias clr='clear'
alias icat='kitty +kitten icat'
alias cd='z'
alias diff='git difftool --no-symlinks --dir-diff'
alias ww='WallWiz'

# Colours
foreground_color='\033[0;1;36m'
command_foreground='\033[0m'
background_color_black='\033[30m'
background_color_cyan='\033[46m'

# Cursor
start='\033[1G'
align_mid='\033[$(( (COLUMNS / 2) - 9 ))C'
align_right='\033[$(($COLUMNS-20))C'
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

export city=kanpur

export COLUMNS

# zoxide
export PATH=$PATH:/home/ss/.local/bin
eval "$(zoxide init bash)"

# deno
export DENO_INSTALL="/home/ss/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
export FZF_DEFAULT_OPTS='
  --color fg:-1,bg:-1,hl:-1,fg+:-1,bg+:-1,hl+:-1
  --color info:-1,prompt:-1,spinner:-1,pointer:-1,marker:-1
'
