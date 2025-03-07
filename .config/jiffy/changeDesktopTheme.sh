#!/usr/bin/env bash

case "$1" in
anime)
  echo source=~/.config/hypr/anime.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.anime/ -f \"STD.setenv('enableBlur',true)\" && kitten @ set-background-opacity -a 0.75"
  ;;
matte)
  echo source=~/.config/hypr/matte.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.mu/ && kitten @ set-background-opacity -a 1"
  ;;
default)
  echo source=~/.config/hypr/default.conf >~/.config/hypr/hyprland.conf
  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden sh -c "WallRizz -n -r -d /home/ss/pics/walls/1920x1080.mix/ -f \"STD.setenv('enableBlur',true)\" && kitten @ set-background-opacity -a 0.75"
  ;;
esac

case "$2" in
dark)
  echo '$themeMode = --no-light-theme' >~/.config/hypr/variables.conf
  ;;
light)
  echo '$themeMode = -l' >~/.config/hypr/variables.conf
  ;;
esac
