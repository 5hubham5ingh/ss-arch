#!/usr/bin/env qjs

import { exec, readdir } from "os";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const wallpapersDir = "/home/ss/Downloads/wallpapers";
const wallpapers = readdir(wallpapersDir)[0].filter(
  (name) => name !== "." && name !== "..",
);
const randomIndex = getRandomInt(0, wallpapers.length - 2);
const wallpaper = wallpapers[randomIndex];
const wallpaperDir = `${wallpapersDir}/${wallpaper}`;

exec(["hyprctl", "hyprpaper unload all"]);
exec(["hyprctl", `hyprpaper preload ${wallpaperDir}`]);
exec(["hyprctl", `hyprpaper wallpaper eDP-1,${wallpaperDir}`]);
