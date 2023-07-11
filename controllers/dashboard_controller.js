import { getData } from '../utils/get_data.js'

export default async (req, res) => {
  if (!req.session.accessToken) {
    return res.redirect('/')
  }

  const userInfo = await getData('/me', req)
  const tracks = await getData('/me/tracks?limit=10', req)

  res.render('dashboard', { user: userInfo, tracks: tracks.items })
}
