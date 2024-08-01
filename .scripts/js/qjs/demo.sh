#!/bin/bash

# Enable Kitty keyboard protocol
printf '\033[>1u'

# Disable canonical mode and echo
stty -icanon -echo

# Trap to restore terminal settings on exit
trap 'stty icanon echo; printf "\033[<1u"; exit' EXIT INT

# Function to read input with a timeout
read_with_timeout() {
  IFS= read -r -t 0.05 -n 1 char
  printf '%s' "$char"
}

# Main loop
while true; do
  key=""
  char=$(read_with_timeout)

  if [[ -z $char ]]; then
    continue
  fi

  # Read the full sequence
  full_seq=$char
  while [[ -n $char ]]; do
    char=$(read_with_timeout)
    full_seq+=$char
  done

  # Process the key based on Kitty keyboard protocol
  case "$full_seq" in
  $'\033[27;'*)
    # Kitty protocol sequence
    key_code=$(echo "$full_seq" | sed -n 's/.*\([A-Za-z~]\)$/\1/p')
    modifier=$(echo "$full_seq" | sed -n 's/\033\[27;\([0-9]*\);.*/\1/p')
    case "$key_code" in
    'A') key="Kitty: Up Arrow (mod: $modifier)" ;;
    'B') key="Kitty: Down Arrow (mod: $modifier)" ;;
    'C') key="Kitty: Right Arrow (mod: $modifier)" ;;
    'D') key="Kitty: Left Arrow (mod: $modifier)" ;;
    '~') key="Kitty: Escape (mod: $modifier)" ;;
    *) key="Kitty: $full_seq (mod: $modifier, code: $key_code)" ;;
    esac
    ;;
  $'\033['*)
    # Traditional CSI sequence
    key="CSI: $full_seq"
    ;;
  $'\033O'*)
    # SS3 sequence
    key="SS3: $full_seq"
    ;;
  $'\033')
    key="ESC"
    ;;
  *)
    key="Char: $full_seq ($(printf '%d' "'$full_seq"))"
    ;;
  esac

  echo "Received: $key"

  # Exit on 'q' key press
  [[ $full_seq == 'q' ]] && break
done
