** NOT NEEDDED ANYMORE - heroku does this for us **

# Generating ssl keys for development

1. `openssl genrsa -out key.pem`
2. `openssl req -new -key key.pem -out csr.pem`
3. `openssl req -new -key key.pem -out csr.pem`, and answer the questions

To tell express to use HTTPS, set `HTTP_SECURE=true` in the `.env` file.

**Note:** The certificate is self-signed, so you will get a warning when you visit the site. This is expected.
