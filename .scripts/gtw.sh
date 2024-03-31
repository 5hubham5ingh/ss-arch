#!/usr/bin/env bash

# goto window number = $1

#----------------------------- Getting required variable's values -------------------------
# Get the active workspace ID
active_workspace_id=$(hyprctl -j monitors | jq -r '.[0].activeWorkspace.id')


# Initialize an empty array to store window IDs
window_ids_in_cache=()
window_ids_from_hyprctl=()

cache_file="$HOME/.custom_cache/wwsm/$active_workspace_id" # For storing visual order of windows in the workapace as a stack
#log_file="/home/ss/hyprctl_log.txt"

# Read the window IDs from the cache file
mapfile -t window_ids_in_cache < "$cache_file"

# Read window IDs from hyprctl
while IFS= read -r window_id; do
    window_ids_from_hyprctl+=("$window_id")
done < <(hyprctl -j clients | jq -r "map(select(.workspace.id == $active_workspace_id)) | .[].address")

cache_count=${#window_ids_in_cache[@]}
hyprctl_count=${#window_ids_from_hyprctl[@]}
#-------------------------------------------------------------------------------------------


#----------------------------------- Cache validation --------------------------------------
# Check if window IDs in cache are stale or not
if [ "$1" == "empty_cache" ]; then
    if [ $hyprctl_count == 1 ]; then
        echo -n '' > "$HOME/.custom_cache/wwsm/$active_workspace_id"
        exit 0
    fi
    exit 0
fi

# Check if the number of elements in hyprctl array is greater than or less than the number of elements in cache array
if [ "$hyprctl_count" -gt "$cache_count" ]; then
    # Append additional elements from hyprctl array to cache array
    additional_elements=$((hyprctl_count - cache_count))
    new_elements=("${window_ids_from_hyprctl[@]:cache_count:additional_elements}")
    window_ids_in_cache+=("${new_elements[@]}")
    echo "Appended $additional_elements elements to cache array."

elif [ "$hyprctl_count" -lt "$cache_count" ]; then
    # Create a new array to store the elements we want to keep
    new_window_ids_in_cache=()
    # Iterate over the window_ids_in_cache array
    for element in "${window_ids_in_cache[@]}"; do
        # Trim leading and trailing spaces from the element
        trimmed_element=$(echo "$element" | tr -d ' ')
        # Check if the trimmed_element is present in the window_ids_from_hyprctl array
        if [[ " ${window_ids_from_hyprctl[@]} " =~ " $trimmed_element " ]]; then
            # If present, add the trimmed_element to the new_window_ids_in_cache array
            new_window_ids_in_cache+=("$trimmed_element")
        fi
    done
    # Assign the new array to window_ids_in_cache
    window_ids_in_cache=("${new_window_ids_in_cache[@]}")
    echo "Removed excess elements from cache array."
fi
#----------------------------------------------------------------------------------------------


#--------------------- Calculate new state of windows in the workspace -------------------------

window_count=${#window_ids_in_cache[@]}
master_window="${window_ids_in_cache[-1]}"
window_index=$(($window_count - ${1} -1))

# Check if the index is within the bounds of the window list
if [ "$window_index" -lt 0 ] || [ "$window_index" -ge "$window_count" ]; then
    echo "Error: Window index out of range. There are $window_count windows on the current workspace." >&2
    exit 1
fi



# Swap the master window ID with the window ID at window_index
window_ids_in_cache[-1]="${window_ids_in_cache[$window_index]}"
window_ids_in_cache[$window_index]="$master_window"
hyprctl_activewindow=$(hyprctl -j activewindow | jq -r '.address')

# Save the new array in the cache
printf '%s\n' "${window_ids_in_cache[@]}" > "$cache_file"

#------------------------------ Generate logs for debugging -----------------------------------
# Genrate log in the log file
# printf 'goto window ${1}=%s window_index = %s\n' "${1}" "${window_index}" >> "$log_file" 
# printf '\n hyprctl activewindow: %s\n' "${hyprctl_activewindow}" >> "$log_file"
# printf '%s id in cache: \n' >> "$log_file"
# printf '%s ' "${window_ids_in_cache[@]}" >> "$log_file"
# printf '\n' >> "$log_file"
# printf '%s id from hyprctl: \n' >> "$log_file"
# printf '%s ' "${window_ids_from_hyprctl[@]}" >> "$log_file"
# printf '\n' >> "$log_file"
# echo "-----------------------------------------------------------------------" >> "$log_file"


#--------------------- Set windows state based on new calutated state -------------------------
hyprctl dispatch focuswindow "address:${window_ids_in_cache[-1]}"
hyprctl dispatch layoutmsg swapwithmaster master
