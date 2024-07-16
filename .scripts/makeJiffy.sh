#!/usr/bin/env bash

# Clone the quickie repo
git clone git@github.com:5hubham5ingh/quickie.git

# Clone the required library
git clone https://github.com/ctn-malone/qjs-ext-lib.git

# Clone the QuickJs source then build and install system wide
git clone https://github.com/bellard/quickjs.git &&
  cd quickjs &&
  make &&
  sudo make install &&
  cd ../quickie &&
  qjsc -fno-proxy -fno-bigint main.js
