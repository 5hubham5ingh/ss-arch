#!/usr/bin/sh

hyprctl dispatch setprop address:$(hyprctl -j clients | jq -r '[.[] | select(.focusHistoryID == 1) | .address][0]') opaque toggle
