#!/bin/sh
# start.sh

redis-server &

node index.js
