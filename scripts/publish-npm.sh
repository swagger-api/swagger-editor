rm dist/package.json
cp scripts/npm.js dist/package.json
npm version patch
npm publish
rm scripts/npm.js
cp dist/package.json scripts/npm.js
