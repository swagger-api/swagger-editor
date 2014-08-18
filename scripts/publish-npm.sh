rm dist/package.json
cp scripts/npm.json dist/package.json
cd dist
npm version patch
npm publish
cd ..
rm scripts/npm.js
cp dist/package.json scripts/npm.json
