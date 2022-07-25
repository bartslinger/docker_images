#!/usr/bin/env bash
docker buildx build --platform=linux/arm -t registry.gitlab.com/mapture.ai/ros/humble-ros-core --push .
