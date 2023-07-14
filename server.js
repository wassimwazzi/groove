import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routers/auth_router.js'
import dashboardRouter from './routers/dashboard_router.js'
import playlistsRouter from './routers/playlists_router.js'
import flashMiddleware from './middleware/flash_middleware.js'
import flash from 'connect-flash'

export const app = express()

app.set('views', './views')
app.set('view engine', 'pug')
app
  .use(express.static('public'))
  .use(cors())
  .use(cookieParser())
  .use(
    session({
      secret: 'your-secret-key', // Replace with a strong secret key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // set secure to true if using HTTPS
    }),
  )
  .use(flash())
  .use(flashMiddleware)
  .use('/images', express.static('images'))
  .use(authRouter)
  .use(dashboardRouter)
  .use(playlistsRouter)

const listener = app.listen(3000, function () {
  console.log('Your app is listening on http://localhost:' + listener.address().port)
})
