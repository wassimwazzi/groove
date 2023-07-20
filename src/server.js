import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routers/auth_router.js'
import dashboardRouter from './routers/dashboard_router.js'
import playlistsRouter from './routers/playlists_router.js'
import playerRouter from './routers/player_router.js'
import flashMiddleware from './middleware/flash_middleware.js'
import flash from 'connect-flash'
import { port, host, HTTP_SECURE } from './config.js'
import crypto from 'crypto'

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
  .use(authRouter)
  .use(dashboardRouter)
  .use(playlistsRouter)
  .use(playerRouter)

const listener = app.listen(port, host, () => {
  console.log(`Server is listening on ${listener.address().address}:${listener.address().port}`)
})
