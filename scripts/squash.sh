#!/usr/bin/env bash

#Squash NPM commits in one commits

#Get the version number
$VERSION = "`git log -1 --pretty='format:%B'`"

# grunt ship makes 4 commits
git reset --soft HEAD~4

git commit -m "Update package versions to $VERSION"
