# Deploy `swagger-editor-dist` to npm.

# Parameter Expansion: http://stackoverflow.com/questions/6393551/what-is-the-meaning-of-0-in-a-bash-script
cd "${0%/*}"

# Get Editor version
EDITOR_VERSION=$(node -p "require('../package.json').version")

# Replace our version placeholder with Editor's version
sed -i.bak "s/\$\$VERSION/$EDITOR_VERSION/g" package.json
rm package.json.bak

# Copy Editor's dist files to our directory
cp ../dist/* .

# Copy LICENSE & NOTICE to our directory
cp ../LICENSE .
cp ../NOTICE .

# Copy index.html
cp ../index.html .

# Rewire `./dist` references to `.` in index.html
sed -i.bak "s/\.\/dist/\./g" index.html
rm index.html.bak

if [ "$PUBLISH_DIST" = "true" ] || [ "$TRAVIS" = "true" ] ; then
  npm publish .
else
  npm pack .
fi

find . -not -name .npmignore -not -name .npmrc -not -name deploy.sh -not -name package.json -not -name README.md -not -name *.tgz -delete
