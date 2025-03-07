#!/bin/bash

dirName="mix"

for file in ./$dirName/*; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    extension="${filename##*.}"
    new_filename="./1920x1080.$dirName/${filename%.*}.jpg"
    magick "$file" -resize 1920x1080 "$new_filename"
  fi
done
