import PlatformsManager from '../utils/platforms_manager.js'

export default async (req, res) => {
  const platform = req.query.platform
  const communicator = PlatformsManager.getCommunicator(platform)
  const playlists = await communicator.getPlaylists(req)
  console.log(platform)
  res.render('dashboard', { platform: platform, playlists: playlists, token: req.session.spotifyAccessToken })
}
