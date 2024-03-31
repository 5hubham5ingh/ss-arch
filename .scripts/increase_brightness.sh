#!/bin/bash

brightness_file="/sys/class/backlight/intel_backlight/brightness"

# Check if the brightness file exists
if [ ! -e "$brightness_file" ]; then
    echo "Error: Brightness file not found ($brightness_file)"
    exit 1
fi

# Increase brightness by 250, ensuring it doesn't go below 0
current_brightness=$(cat "$brightness_file")
new_brightness=$((current_brightness + 250))
new_brightness=$((new_brightness <= 120000 ? new_brightness : 120000))

# Write the new brightness value to the file
echo "$new_brightness" > "$brightness_file"

