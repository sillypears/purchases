#!/bin/bash

scp -r /home/blap/projects/purchases podme:/tmp/

ssh podme "docker stop purchases || true && docker rm purchases || true"

ssh podme "cd /tmp/purchases && docker build -t purchases ."

ssh podme "docker run -d -p 3003:3003 -e HOSTNAME=0.0.0.0 -e NODE_ENV=prod --name purchases purchases"

ssh podme "rm -rf /tmp/purchases"
