#!/usr/bin/env bash

#Squash NPM commits in one commits

# grunt ship makes 4 commits
git reset --soft HEAD~4

git commit -m "Update package versions to `npm view swagger-editor-src version --silent`"
