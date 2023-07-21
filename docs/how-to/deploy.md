# Deploying with heroku

## Prerequisites

### Heroku account

https://signup.heroku.com/

### Install heroku CLI

https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up

- macOS: `brew tap heroku/brew && brew install heroku`
- Windows: [Download](https://cli-assets.heroku.com/heroku-x64.exe)

Run `heroku login` to login to your heroku account.heroku create

## Deploying

- If you are creating a new environment, run `heroku create` to create a new heroku app.
- `git push heroku {branch}:main` to deploy your branch to heroku.

## Configuring

Any env variables need to be set in the heroku app. You can do this in the heroku dashboard, settings, config vars.
