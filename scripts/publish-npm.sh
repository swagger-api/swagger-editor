#!/usr/bin/env bash

rm dist/package.json
cp scripts/npm.json dist/package.json
cd dist
npm version patch
npm publish
cd ..
cp dist/package.json scripts/npm.json
git add scripts/npm.json
git commit -m 'Update version of NPM package of minfied package'
npm version patch
