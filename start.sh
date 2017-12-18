#!/bin/sh
docker run -d --name jesus-coin -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt jesus-coin:latest