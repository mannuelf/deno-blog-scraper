#!/bin/bash

# Stop containers
sudo docker stop $(sudo docker ps -aq)

# Delete stopped containers
sudo docker rm $(sudo docker ps -aq)

# Delete unused Docker networks
sudo docker network prune --force

# Delete Docker Images
sudo docker rmi $(docker images -a -q)

export DOCKER_BUILDKIT=1

sudo docker network create web
