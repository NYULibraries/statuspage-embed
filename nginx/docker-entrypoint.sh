#!/bin/sh -ex

# Inject env vars into config
# sed -i "s|\$LOCAL_SERVER|$LOCAL_SERVER|g" /etc/nginx/conf.d/default.conf

exec "$@"
