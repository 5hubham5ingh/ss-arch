#!/bin/bash

for file in ./desktop/*; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    extension="${filename##*.}"
    new_filename="./1920x1080/${filename%.*}.jpg"
    magick convert "$file" -resize 1920x1080 "$new_filename"
  fi
done
