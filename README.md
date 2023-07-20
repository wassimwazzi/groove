# Groove

## Description

Groove is a website that allows users to manage their playlists from many different plaforms

## Installation

### Requirements

- Node.js
- npm

### Steps

1. Clone the repository
2. Run `npm install` in the root directory
3. Copy the `.env.example` file to `.env` and fill in the values. Follow the [.env setup](#env-setup) steps.
4. Run `npm start` in the root directory

## .env Setup

### Spotify

- If you have a Spotify premium account:
  1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
  2. Create a new app
  3. Copy the Client ID and Client Secret into the `.env` file
  4. Add `http://localhost:[env.PORT]/callback` to the Redirect URIs in the Spotify Developer Dashboard
- If you don't have a premium account, ask me for the credentials.

## Pre-Commit Hooks

Run `chmod +x .husky/pre-commit` to enable pre-commit hooks.
Everytime you make a commit, the linter and test suite will run. If either fails, the commit will be aborted.
To make a commit without running the hooks, run `git commit --no-verify` or `git commit -n`.

## Testing

Run `npm test` in the root directory

## Style Guide

The project uses eslint and prettier to enforce a style guide.
Run `npm run eslint --fix` to fix style errors.
Run `npm run prettier --fix` to fix style errors.
