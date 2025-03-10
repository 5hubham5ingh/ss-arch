#!/usr/bin/env bash

updateWallpaperDirEnvVarInBashrc() {
  local new_export_line="export WALLPAPER_DIR=\"$1\""
  grep -q "^export WALLPAPER_DIR=" ~/.bashrc &&
    sed -i "s@^export WALLPAPER_DIR=.*@$new_export_line@" ~/.bashrc ||
    echo "$new_export_line" >>~/.bashrc
}

setWallpaperConfig() {
  local profile="$1"
  declare -A wallDirs=(
    [anime]="/home/ss/pics/walls/1920x1080.anime/"
    [matte]="/home/ss/pics/walls/1920x1080.mu/"
    [default]="/home/ss/pics/walls/1920x1080.mix/"
  )

  local wallDir="${wallDirs[$profile]}"
  [ -z "$wallDir" ] && return # Exit if invalid profile

  local config_file=~/.config/hypr/hyprland.conf
  local new_source="source=~/.config/hypr/$profile.conf"

  # If a "source=~/.config/hypr/..." line exists, replace it; otherwise, append it
  if grep -q "^source=~/.config/hypr/.*\.conf" "$config_file"; then
    sed -i "s@^source=~/.config/hypr/.*\.conf@$new_source@" "$config_file"
  else
    echo "$new_source" >>"$config_file"
  fi

  local blur_flag=""
  [ "$profile" != "matte" ] && blur_flag="-f \"STD.setenv('enableBlur',true)\""

  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden \
    sh -c "WallRizz -n -r -d \"$wallDir\" $blur_flag && kitten @ set-background-opacity -a ${blur_flag:+0.75} ${blur_flag:+'1'}"

  updateWallpaperDirEnvVarInBashrc "$wallDir"
}

updateThemeMode() {
  local new_export_line="\$themeMode=$1"
  grep -q "^\$themeMode=" ~/.config/hypr/hyprland.conf &&
    sed -i "s@^\$themeMode=.*@$new_export_line@" ~/.config/hypr/hyprland.conf ||
    echo "$new_export_line" >>~/.config/hypr/hyprland.conf
}

setWallpaperConfig "$1"
[ -n "$2" ] && updateThemeMode "$([[ "$2" == "dark" ]] && echo "--no-light-theme" || echo "-l")"
