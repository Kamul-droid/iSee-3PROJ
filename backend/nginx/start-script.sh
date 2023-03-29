#! /bin/sh

nohup node /nginx-local-node-server/index.js > /logs/node-server.log &
/usr/local/nginx/sbin/nginx -g 'daemon off;'