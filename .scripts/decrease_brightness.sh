#!/bin/bash

brightness_file="/sys/class/backlight/intel_backlight/brightness"

# Check if the brightness file exists
if [ ! -e "$brightness_file" ]; then
    echo "Error: Brightness file not found ($brightness_file)"
    exit 1
fi

# Decrease brightness by 1000, ensuring it doesn't go below 0
current_brightness=$(cat "$brightness_file")
new_brightness=$((current_brightness - 500))
new_brightness=$((new_brightness > 0 ? new_brightness : 500))

# Write the new brightness value to the file
echo "$new_brightness" > "$brightness_file"

echo "Brightness changed to $new_brightness"

