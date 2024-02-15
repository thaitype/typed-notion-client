#!/bin/bash

pnpm publish --access public \
  && git tag -a $1 -m "release $1" \
  && git push origin $1
