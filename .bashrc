#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

if [ -f ~/.system_specific_shell_config ]; then
  source ~/.system_specific_shell_config
fi

alias ls='ls --color=auto'
alias yz='yazi'
alias grep='grep --color=auto'
alias clr='clear'
alias icat='kitty +kitten icat'
alias cd='z'
alias diff='git difftool --no-symlinks --dir-diff'
alias wr='WallRizz'
fzi() {
  fzf --layout=reverse --color=16,current-bg:-1,current-fg:-1 --prompt= --marker= --pointer= --info inline-right --preview-window='70%,border-none' --preview='kitty icat --clear --transfer-mode=memory --stdin=no --scale-up --place=${FZF_PREVIEW_COLUMNS}x${FZF_PREVIEW_LINES}@0x0 {}'
}

# Colours
foreground_color='\033[0;1;36m'
command_foreground='\033[0m'
foreground_color_black='\033[38;2;0;0;0m'
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
reset='\033[0m'

# Prompt components
prompt="${foreground_color}--> ${command_foreground}"
dir="\[${foreground_color}${foreground_color_black}${background_color_cyan}\]\W\[${foreground_color}\]"
user_and_host="${foreground_color}${background_color_black}${background_color_cyan}\u${foreground_color}${foreground_color}${background_color_black}${background_color_cyan}@${foreground_color}${foreground_color}${background_color_black}${background_color_cyan}\h${foreground_color}"
info="\[${foreground_color}${foreground_color_black}${background_color_cyan}\]\A\[${foreground_color} ${foreground_color}${foreground_color_black}${background_color_cyan}\]\d\[${foreground_color}\]"

# Prompt string
# PS1="\[${align_right}\]${info}\[${start}\]-->\[${reset}\] "
#PS1="${dir}${start}${align_mid}${user_and_host}${start}${align_right}${info}${prompt}"
# PS1="${dir}\[${reset}\] "
PS1="--> "

export COLUMNS

# zoxide
export PATH=$PATH:/home/ss/.local/bin
eval "$(zoxide init bash)"

# deno
export DENO_INSTALL="/home/ss/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

export WALLPAPER_DIR="/home/ss/pics/walls/1920x1080/"
export WALLPAPER_REPO_URLS="https://github.com/D3Ext/aesthetic-wallpapers/tree/main/images ; https://github.com/5hubham5ingh/WallWiz/tree/wallpapers/"

# Jiffy
export TERMINAL="kitty -1 --hold"
