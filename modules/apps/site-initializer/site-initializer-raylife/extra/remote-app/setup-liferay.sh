#!/bin/bash
ORIGIN=build/static
TARGET=build/static/css

mkdir -p $TARGET

# cp $ORIGIN/main*.js $TARGET/main.min.js
# cp $ORIGIN/2*.chunk.js $TARGET/2.chunk.min.js
# cp $ORIGIN/runtime-main*.js $TARGET/runtime-main.min.js

cp $ORIGIN/css/main*.css $TARGET/main.min.css

echo "liferay setup:"
echo "- $TARGET/main.min.js"
echo "- $TARGET/2.chunk.min.js"
echo "- $TARGET/runtime-main.min.js"