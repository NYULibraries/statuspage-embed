#!/bin/sh -e

start_time=$(date +%s)
timeout=30 #seconds
while ! curl -f $PLAYWRIGHT_BASE_URL -o /dev/null; do
  sleep 3
  now=$(date +%s)
  if [ $(( now - start_time )) -gt $timeout ]; then
    echo "Unable to connect to $PLAYWRIGHT_BASE_URL after $timeout seconds; aborting!"
    exit 1
  fi
done

exec "$@"
