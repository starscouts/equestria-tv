#!/usr/bin/env bash

./electron/electron --enable-features=VaapiVideoDecoder --flag-switches-begin --enable-features=ignore-gpu-blocklist,enable-accelerated-video-decode --flag-switches-end --use-gl=egl index.js prod