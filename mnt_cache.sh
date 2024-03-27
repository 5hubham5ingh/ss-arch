#!/bin/bash

# Set the directory to mount the tmpfs filesystem
mount_dir="$HOME/.custom_cache/wwsm"

# Create the directory if it doesn't exist
mkdir -p "$mount_dir"

# Mount the tmpfs filesystem
sudo mount -t tmpfs tmpfs "$mount_dir"

# Change ownership of the mounted directory to the current user
sudo chown $(whoami):$(whoami) "$mount_dir"

# Create 9 files named from 1 to 9 within the mounted tmpfs filesystem
for i in {1..9}; do
    touch "$mount_dir/$i"
done

# Set permissions to allow anyone to read from and write to these files
chmod a+rw "$mount_dir"/*

echo "tmpfs filesystem mounted at $mount_dir"
