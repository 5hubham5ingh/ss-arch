#!/bin/bash

curl -s wttr.in | sed -n '8,17p'

while true; do

    # Store the output of upower command in an array
    readarray -t batteryInfoArray <<< "$(upower -i /org/freedesktop/UPower/devices/battery_BAT1 | sed -n -E '/state|percentage/{s/^\s+|\s+$//g;p}')"

    # Store the output of iwctl command in an array
    readarray -t wifiInfoArray <<< "$(iwctl --dont-ask station wlan0 show | sed -n -E '/Connected network|State/{s/^\s+|\s+$//g;p}')"

    # Print the table header
    printf "%-25s\n" "|--------------------------------------|-----------------------------------|"
    printf "%-25s\n" "|               Battery                |                WIFI               |"
    printf "%-25s\n" "|--------------------------------------|-----------------------------------|"
    # Iterate over the arrays and print corresponding elements with proper spacing
    for ((i = 0; i < ${#batteryInfoArray[@]}; i++)); do
        printf "| %-36s | %-33s |\n" "${batteryInfoArray[$i]}" "${wifiInfoArray[$i]}"

    done
    # Print the table footer
    printf "%-25s\n" "|--------------------------------------|-----------------------------------|"

    sleep 300

    # Move the cursor up 5 lines
    printf "\033[6A"

    # Clear the next 5 lines
    for ((i = 0; i < 6; i++)); do
        printf "\033[K\n"
    done

     # Move the cursor up 5 lines
    printf "\033[6A"
done