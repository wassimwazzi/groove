import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routers/routes.js'
import flashMiddleware from './middleware/flash_middleware.js'
import flash from 'connect-flash'
import { port, host, HTTP_SECURE } from './config.js'
import crypto from 'crypto'
import https from 'https'
import fs from 'fs'

export const app = express()

app.set('views', './src/views')
app.set('view engine', 'pug')
app
  .use(express.json())
  .use(express.static('src/public'))
  .use(cors())
  .use(cookieParser())
  .use(
    session({
      secret: crypto.randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: true,
      cookie: { secure: HTTP_SECURE },
    }),
  )
  .use(flash())
  .use(flashMiddleware)
  .use('/images', express.static('images'))
  .use(routes)

HTTP_SECURE
  ? https
      .createServer(
        {
          key: fs.readFileSync('certs/key.pem'),
          cert: fs.readFileSync('certs/cert.pem'),
        },
        app,
      )
      .listen(port, host, () => {
        console.log(`Server is listening on ${host}:${port}`)
      })
  : app.listen(port, host, () => {
      console.log(`Server is listening on ${host}:${port}`)
    })
