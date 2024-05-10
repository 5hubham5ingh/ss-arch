#!/bin/bash

printf "\033[${1}A"  

for ((i = 0; i < $1; i++)); do
    printf "\033[2K\n" 
done

printf "\033[${1}A"  

