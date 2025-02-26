#!/usr/bin/env bash

# Combined FZF Key Bindings and Simple Completion Script

### key-bindings.bash ###
#     ____      ____
#    / __/___  / __/
#   / /_/_  / / /_
#  / __/ / /_/ __/
# /_/   /___/_/ key-bindings.bash
#
# - $FZF_TMUX_OPTS
# - $FZF_CTRL_T_COMMAND
# - $FZF_CTRL_T_OPTS
# - $FZF_CTRL_R_OPTS
# - $FZF_ALT_C_COMMAND
# - $FZF_ALT_C_OPTS

if [[ $- =~ i ]]; then

  # Key bindings
  # ------------

  __fzf_defaults() {
    # $1: Prepend to FZF_DEFAULT_OPTS_FILE and FZF_DEFAULT_OPTS
    # $2: Append to FZF_DEFAULT_OPTS_FILE and FZF_DEFAULT_OPTS
    echo "--height ${FZF_TMUX_HEIGHT:-40%} --min-height 20+ --bind=ctrl-z:ignore $1"
    command cat "${FZF_DEFAULT_OPTS_FILE-}" 2>/dev/null
    echo "${FZF_DEFAULT_OPTS-} $2"
  }

  __fzf_select__() {
    FZF_DEFAULT_COMMAND=${FZF_CTRL_T_COMMAND:-} \
      FZF_DEFAULT_OPTS=$(__fzf_defaults "--reverse --walker=file,dir,follow,hidden --scheme=path" "${FZF_CTRL_T_OPTS-} -m") \
      FZF_DEFAULT_OPTS_FILE='' $(__fzfcmd) "$@" |
      while read -r item; do
        printf '%q ' "$item" # escape special chars
      done
  }

  __fzfcmd() {
    [[ -n "${TMUX_PANE-}" ]] && { [[ "${FZF_TMUX:-0}" != 0 ]] || [[ -n "${FZF_TMUX_OPTS-}" ]]; } &&
      echo "fzf-tmux ${FZF_TMUX_OPTS:--d${FZF_TMUX_HEIGHT:-40%}} -- " || echo "fzf"
  }

  fzf-file-widget() {
    local selected="$(__fzf_select__ "$@")"
    READLINE_LINE="${READLINE_LINE:0:$READLINE_POINT}$selected${READLINE_LINE:$READLINE_POINT}"
    READLINE_POINT=$((READLINE_POINT + ${#selected}))
  }

  __fzf_cd__() {
    local dir
    dir=$(
      FZF_DEFAULT_COMMAND=${FZF_ALT_C_COMMAND:-} \
        FZF_DEFAULT_OPTS=$(__fzf_defaults "--reverse --walker=dir,follow,hidden --scheme=path" "${FZF_ALT_C_OPTS-} +m") \
        FZF_DEFAULT_OPTS_FILE='' $(__fzfcmd)
    ) && printf 'builtin cd -- %q' "$(builtin unset CDPATH && builtin cd -- "$dir" && builtin pwd)"
  }

  if command -v perl >/dev/null; then
    __fzf_history__() {
      local output script
      script='BEGIN { getc; $/ = "\n\t"; $HISTCOUNT = $ENV{last_hist} + 1 } s/^[ *]//; s/\n/\n\t/gm; print $HISTCOUNT - $. . "\t$_" if !$seen{$_}++'
      output=$(
        set +o pipefail
        builtin fc -lnr -2147483648 |
          last_hist=$(HISTTIMEFORMAT='' builtin history 1) command perl -n -l0 -e "$script" |
          FZF_DEFAULT_OPTS=$(__fzf_defaults "" "-n2..,.. --scheme=history --bind=ctrl-r:toggle-sort --wrap-sign '"$'\t'"↳ ' --highlight-line ${FZF_CTRL_R_OPTS-} +m --read0") \
          FZF_DEFAULT_OPTS_FILE='' $(__fzfcmd) --query "$READLINE_LINE"
      ) || return
      READLINE_LINE=$(command perl -pe 's/^\d*\t//' <<<"$output")
      if [[ -z "$READLINE_POINT" ]]; then
        echo "$READLINE_LINE"
      else
        READLINE_POINT=0x7fffffff
      fi
    }
  else # awk - fallback for POSIX systems
    __fzf_history__() {
      local output script n x y z d
      if [[ -z $__fzf_awk ]]; then
        __fzf_awk=awk
        # choose the faster mawk if: it's installed && build date >= 20230322 && version >= 1.3.4
        IFS=' .' read n x y z d <<<$(command mawk -W version 2>/dev/null)
        [[ $n == mawk ]] && ((d >= 20230302 && (x * 1000 + y) * 1000 + z >= 1003004)) && __fzf_awk=mawk
      fi
      [[ $(HISTTIMEFORMAT='' builtin history 1) =~ [[:digit:]]+ ]] # how many history entries
      script='function P(b) { ++n; sub(/^[ *]/, "", b); if (!seen[b]++) { printf "%d\t%s%c", '$((BASH_REMATCH + 1))' - n, b, 0 } }
    NR==1 { b = substr($0, 2); next }
    /^\t/ { P(b); b = substr($0, 2); next }
    { b = b RS $0 }
    END { if (NR) P(b) }'
      output=$(
        set +o pipefail
        builtin fc -lnr -2147483648 2>/dev/null | # ( $'\t '<lines>$'\n' )* ; <lines> ::= [^\n]* ( $'\n'<lines> )*
          command $__fzf_awk "$script" |          # ( <counter>$'\t'<lines>$'\000' )*
          FZF_DEFAULT_OPTS=$(__fzf_defaults "" "-n2..,.. --scheme=history --bind=ctrl-r:toggle-sort --wrap-sign '"$'\t'"↳ ' --highlight-line ${FZF_CTRL_R_OPTS-} +m --read0") \
          FZF_DEFAULT_OPTS_FILE='' $(__fzfcmd) --query "$READLINE_LINE"
      ) || return
      READLINE_LINE=${output#*$'\t'}
      if [[ -z "$READLINE_POINT" ]]; then
        echo "$READLINE_LINE"
      else
        READLINE_POINT=0x7fffffff
      fi
    }
  fi

  # Required to refresh the prompt after fzf
  bind -m emacs-standard '"\er": redraw-current-line'

  bind -m vi-command '"\C-z": emacs-editing-mode'
  bind -m vi-insert '"\C-z": emacs-editing-mode'
  bind -m emacs-standard '"\C-z": vi-editing-mode'

  if ((BASH_VERSINFO[0] < 4)); then
    # CTRL-T - Paste the selected file path into the command line
    if [[ "${FZF_CTRL_T_COMMAND-x}" != "" ]]; then
      bind -m emacs-standard '"\C-t": " \C-b\C-k \C-u`__fzf_select__`\e\C-e\er\C-a\C-y\C-h\C-e\e \C-y\ey\C-x\C-x\C-f"'
      bind -m vi-command '"\C-t": "\C-z\C-t\C-z"'
      bind -m vi-insert '"\C-t": "\C-z\C-t\C-z"'
    fi

    # CTRL-R - Paste the selected command from history into the command line
    bind -m emacs-standard '"\C-r": "\C-e \C-u\C-y\ey\C-u`__fzf_history__`\e\C-e\er"'
    bind -m vi-command '"\C-r": "\C-z\C-r\C-z"'
    bind -m vi-insert '"\C-r": "\C-z\C-r\C-z"'
  else
    # CTRL-T - Paste the selected file path into the command line
    if [[ "${FZF_CTRL_T_COMMAND-x}" != "" ]]; then
      bind -m emacs-standard -x '"\C-t": fzf-file-widget'
      bind -m vi-command -x '"\C-t": fzf-file-widget'
      bind -m vi-insert -x '"\C-t": fzf-file-widget'
    fi

    # CTRL-R - Paste the selected command from history into the command line
    bind -m emacs-standard -x '"\C-r": __fzf_history__'
    bind -m vi-command -x '"\C-r": __fzf_history__'
    bind -m vi-insert -x '"\C-r": __fzf_history__'
  fi

  # ALT-C - cd into the selected directory
  if [[ "${FZF_ALT_C_COMMAND-x}" != "" ]]; then
    bind -m emacs-standard '"\ec": " \C-b\C-k \C-u`__fzf_cd__`\e\C-e\er\C-m\C-y\C-h\e \C-y\ey\C-x\C-x\C-d"'
    bind -m vi-command '"\ec": "\C-z\ec\C-z"'
    bind -m vi-insert '"\ec": "\C-z\ec\C-z"'
  fi

fi
### end: key-bindings.bash ###

### FZF SIMPLE COMPLETION ###
# Pipe bash tab-completion suggestions into fzf fuzzy finder
# More details at https://github.com/duong-db/fzf-simple-completion

bind '"\e[0n": redraw-current-line'
export FZF_DEFAULT_OPTS="--bind=tab:down --bind=btab:up --cycle"

_fzf_command_completion() {
  [[ -z "${COMP_LINE// /}" || $COMP_POINT -ne ${#COMP_LINE} ]] && return
  local query="${COMP_WORDS[COMP_CWORD]}"
  COMPREPLY=$(
    # Use compgen for commands completion
    compgen -c -- "$query" 2>/dev/null | LC_ALL=C sort -u |
      fzf --reverse --height 12 --select-1 --exit-0 --query "$query"
  )
  printf '\e[5n'
}

_fzf_get_argument_list() {
  local _command command=${COMP_LINE%% *}
  source /usr/share/bash-completion/bash_completion
  _command=$(complete -p "$command" 2>/dev/null | awk '{print $(NF-1)}')

  if [[ -z $_command ]]; then
    # Load completion using _completion_loader from bash_completion script
    _completion_loader "$command"
    _command=$(complete -p "$command" 2>/dev/null | awk '{print $(NF-1)}')
  fi
  "$_command" 2>/dev/null

  # Add color
  for i in "${!COMPREPLY[@]}"; do
    # "~/Documents" is not recognized as a directory due to quotes so we need to expand tilde
    if [[ -e "${COMPREPLY[i]/#~/$HOME}" ]]; then
      COMPREPLY[i]=$(ls -F -d --color=always "${COMPREPLY[i]/#~/$HOME}" 2>/dev/null)
    fi
  done
  printf '%s\n' "${COMPREPLY[@]}" | LC_ALL=C sort -u | LC_ALL=C sort -t '.' -k2
}

_fzf_argument_completion() {
  [[ $COMP_POINT -ne ${#COMP_LINE} ]] && return
  local fzf_opts="--ansi --reverse --height 12 --select-1 --exit-0"
  local query="${COMP_WORDS[COMP_CWORD]}"

  # Hack on directories completion
  # - Only display the last sub directory for fzf searching
  #     Example. a/b/c/ -> a//b//c/ -> c/
  # - Handle the case where directory contains spaces
  #     Example. New Folder/ -> New\ Folder/
  # - Revert $HOME back to tilde
  COMPREPLY=$(
    _fzf_get_argument_list |
      sed 's|/|//|g; s|/$||' | fzf $fzf_opts -d '//' --with-nth='-1..' --query "$query" | sed 's|//|/|g' |
      sed 's| |\\ |g; s|\\ $| |' |
      sed "s|^$HOME|~|"
  )
  printf '\e[5n'
}

# Remove default completions
complete -r

# Set fuzzy completion
complete -o nospace -I -F _fzf_command_completion
complete -o nospace -D -F _fzf_argument_completion

# Bind Shift+Tab to trigger fzf completion
bind '"\e[Z": complete' # Shift+Tab

# Turn off case sensitivity for better user experience
bind 'set completion-ignore-case on'
### end: FZF SIMPLE COMPLETION ###
