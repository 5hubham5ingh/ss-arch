#!/usr/bin/env bash

updateWallpaperDirEnvVarInBashrc() {
  local new_export_line="export WALLPAPER_DIR=\"$1\""
  if grep -q "^export WALLPAPER_DIR=" ~/.bashrc; then
    sed -i "s@^export WALLPAPER_DIR=.*@$new_export_line@" ~/.bashrc
  else
    echo "$new_export_line" >>~/.bashrc
  fi
}

setWallpaperConfig() {
  local profile="$1"
  declare -A wallDirs=(
    [anime]="/home/ss/pics/walls/1920x1080.anime/"
    [matte]="/home/ss/pics/walls/1920x1080.mu/"
    [default]="/home/ss/pics/walls/1920x1080.mix/"
  )

  local wallDir="${wallDirs[$profile]}"
  if [ -z "$wallDir" ]; then
    return # Exit if invalid profile
  fi

  local config_file=~/.config/hypr/hyprland.conf
  local new_source="source=~/.config/hypr/$profile.conf"

  if grep -q "^source=~/.config/hypr/.*\.conf" "$config_file"; then
    sed -i "s@^source=~/.config/hypr/.*\.conf@$new_source@" "$config_file"
  else
    echo "$new_source" >>"$config_file"
  fi

  local blur_flag=""
  if [ "$profile" != "matte" ]; then
    blur_flag="-f \"STD.setenv('enableBlur',true)\""
    opacity_arg="0.75"
  else
    opacity_arg='1'
  fi

  kitty -1 -o allow_remote_control=yes --class=hidden --title=hidden \
    sh -c "WallRizz -n -r -d \"$wallDir\" $blur_flag && kitten @ set-background-opacity -a ${opacity_arg}"

  updateWallpaperDirEnvVarInBashrc "$wallDir"
}

updateThemeMode() {
  local new_export_line="\$themeMode=$1"
  if grep -q "^\$themeMode=" ~/.config/hypr/hyprland.conf; then
    sed -i "s@^\$themeMode=.*@$new_export_line@" ~/.config/hypr/hyprland.conf
  else
    echo "$new_export_line" >>~/.config/hypr/hyprland.conf
  fi
}

setWallpaperConfig "$1"

if [ -n "$2" ]; then
  local theme_arg
  if [ "$2" == "dark" ]; then
    theme_arg="--no-light-theme"
  else
    theme_arg="-l"
  fi
  updateThemeMode "$theme_arg"
fi
