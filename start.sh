#!/bin/sh
docker run -d --name holiday-coin -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt holiday-coin:latest