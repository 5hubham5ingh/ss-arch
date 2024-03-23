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
master_window_id=$(echo "$window_ids" | sed -n "$((window_index+1))p")

# Prepare the batch instructions
instructions="
focuswindow address:$master_window_id;
movetomaster address:$master_window_id;
"

# Get the master window PID
master_window_pid=$(hyprctl --batch "$instructions" clients "$master_window_id" | grep -oP 'pid: \K\d+')
kitty @ --match="pid:$master_window_pid" set-font-size 1.0

# Set scale 0.5 for the slave window kitty terminals
slave_window_ids=$(echo "$window_ids" | grep -v "$master_window_id")
for slave_window_id in $slave_window_ids; do
    slave_window_pid=$(hyprctl clients "$slave_window_id" | grep -oP 'pid: \K\d+')
    kitty @ --match="pid:$slave_window_pid" set-font-size 0.5
done
