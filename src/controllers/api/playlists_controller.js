import PlatformsManager from '../../utils/platforms_manager.js'

async function getPlaylistTracks(req, res) {
  const platform = req.query.platform
  const playlistId = req.params.playlistId
  const communicator = PlatformsManager.getCommunicator(platform)
  const tracks = await communicator.getPlaylistTracks(req, playlistId)
  res.send(tracks)
}

export { getPlaylistTracks }
