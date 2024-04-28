#!/bin/bash

# start if workspace is getting started else stop
hyprctl dispatch -- exec kitty -c ~/.config/kitty/dashboard.conf --session special_workspace_session 