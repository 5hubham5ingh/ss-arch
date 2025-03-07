#!/usr/bin/bash

magick "$1" -resize x970 -background none -gravity east -extent 1810x970 "$1"
