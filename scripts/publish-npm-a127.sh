#!/usr/bin/env bash

rm dist/package.json
cp scripts/a127.json dist/package.json
cd dist
npm version patch
npm publish
cd ..
cp dist/package.json scripts/a127.json
git add scripts/a127.json
git commit -m 'Update version of NPM package for Apigee-127'
npm version patch
