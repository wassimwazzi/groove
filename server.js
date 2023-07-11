import express from 'express'
import session from 'express-session'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routers/auth_router.js'
import dashboardRouter from './routers/dashboard_router.js'

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
      saveUninitialized: false,
    }),
  )
app.use(authRouter)
app.use(dashboardRouter)

const listener = app.listen(3000, function () {
  console.log('Your app is listening on http://localhost:' + listener.address().port)
})
