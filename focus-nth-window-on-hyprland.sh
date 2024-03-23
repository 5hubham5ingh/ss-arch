#!/usr/bin/env bash

# Check if the script is called with an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <window_index>"
    exit 1
fi

# Validate the argument as a number
if ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "Error: Invalid window index. Must be a non-negative integer."
    exit 1
fi

# Get the active workspace ID
active_workspace=$(hyprctl -j monitors | jq -r '.[0].activeWorkspace.id')

# Get the list of window IDs on the active workspace
window_ids=$(hyprctl -j clients | jq -r '.[] | select(.workspace == '"$active_workspace"') | .address')

# Convert the argument to an index (bash arrays start at 0)
window_index=$((${1} - 1))

# Check if the index is within the bounds of the window list
window_count=$(echo "$window_ids" | wc -l)
if [ "$window_index" -lt 0 ] || [ "$window_index" -ge "$window_count" ]; then
    echo "Error: Window index out of range. There are $window_count windows on the current workspace."
    exit 1
fi

# Get the window ID to focus
window_id=$(echo "$window_ids" | sed -n "$((window_index+1))p")

# Focus the selected window
hyprctl dispatch focuswindow "address:$window_id"

# for execution ./script-name.sh <window-index>
