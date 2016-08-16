'#!/bin/bash'

echo 'checkout master'
git checkout master

echo 'pull origin master'
git pull origin master

echo '>> rm -rf node_modules'
rm -rf node_modules

echo '>> npm install'
npm install

echo '>> git checkout gh-pages'
git checkout gh-pages

echo '>> git merge --no-edit --no-ff origin/master'
git merge --no-edit --no-ff origin/master

echo '>> npm run build'
npm run build

echo '>> git add -A'
git add -A

echo '>> git commit -m "Update from master at $(git rev-parse --short master)"'
git commit -m "Update from master at $(git rev-parse --short master)"

echo '>> npm test'
npm test

echo '>> git push origin gh-pages'
git push origin gh-pages

echo '>> git checkout -'
git checkout -

echo 'deployed to gh-pages'
