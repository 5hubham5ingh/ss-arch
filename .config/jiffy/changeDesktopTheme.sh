#!/usr/bin/env bash

case "$1" in
anime)
  echo source=~/.config/hypr/anime.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.anime/ && kitten @ set-background-opacity -a 0.75"
  ;;
mu)
  echo source=~/.config/hypr/matte.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.mu/ && kitten @ set-background-opacity -a 1"
  ;;
*)
  echo source=~/.config/hypr/default.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.mix/ && kitten @ set-background-opacity -a 0.75"
  ;;
esac
