#!/usr/bin/env bash

#Squash NPM commits in one commits

# grunt ship makes 5 commits
git reset --soft HEAD~5

git commit -m "Update package versions"
