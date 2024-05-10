#!/bin/bash

while true; do
    current_brightness=$(cat /sys/class/backlight/intel_backlight/brightness)
    max_brightness=$(cat /sys/class/backlight/intel_backlight/max_brightness)

    brightness=$(( ($current_brightness * 100) / $max_brightness ))

    bringhtnewInfo=();
    
    brightnessInfo+=("Brightness:  ${brightness}%      ");
    brightnessInfo+=("Resolution:  1920x1080");

    device="$(pactl list sinks | grep 'Active Port' | sed -E 's/.*analog-output-(headphones|speaker)/\1/')"

    volume="$(pactl list sinks | grep 'Volume: fro' | sed -E 's/.* ([0-9]+)% .*/\1/')"

    # Create an array to store sound information
    volumeInfo=()

    # Append sound information to the array
    volumeInfo+=("Device:       ${device} ")
    volumeInfo+=("Volume:       ${volume}%     ")

    # Store the output of upower command in an array
    readarray -t batteryInfoArray <<< "$(upower -i /org/freedesktop/UPower/devices/battery_BAT1 | sed -n -E '/state|percentage/{s/^\s+|\s+$//g;p}')"

    # Store the output of iwctl command in an array
    readarray -t wifiInfoArray <<< "$(iwctl --dont-ask station wlan0 show | sed -n -E '/Connected network|State/{s/^\s+|\s+$//g;p}')"

    # Print the table header
    printf "%-25s\n" " |-----------------------------------|----------------------------------|------------------------|------------------------|"
    printf "%-25s\n" " |             Battery               |               WIFI               |          Sound         |         Screen         |"
    printf "%-25s\n" " |-----------------------------------|----------------------------------|------------------------|------------------------|"
    # Iterate over the arrays and print corresponding elements with proper spacing
    for ((i = 0; i < ${#batteryInfoArray[@]}; i++)); do
        printf " | %-33s | %-32s | %-1s | %-1s |\n" "${batteryInfoArray[$i]}" "${wifiInfoArray[$i]}" "${volumeInfo[$i]}" "${brightnessInfo[$i]}"

    done
    # Print the table footer
    printf "%-25s\n" " |-----------------------------------|----------------------------------|------------------------|------------------------|"

    sleep 1

    # Move the cursor up 5 lines
    printf "\033[6A"

    # Clear the next 5 lines
    for ((i = 0; i < 6; i++)); do
        printf "\033[K\n"
    done

     # Move the cursor up 5 lines
    printf "\033[6A"
done
