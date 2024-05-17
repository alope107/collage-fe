#!/bin/sh
# Usage:
# deploy.sh s3://bucket-name/key-name

aws s3 cp build $1 --recursive