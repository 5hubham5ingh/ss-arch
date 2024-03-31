#!/bin/bash

# This loop runs indefinitely in the background
while true; do
  # Check the battery status every 5 seconds
  sleep 5

  # Get battery percentage (if available)
  battery_percentage=$(upower -e | grep 'BAT' | grep percentage | awk '{print $2}' | tr -d '%')

  # Check if battery percentage is a valid integer and below 80
  if [[ $battery_percentage -lt 50 ]]; then
    kitty --hold sh -c "echo Battery low!!! $battery_percentage"
  fi
done &

