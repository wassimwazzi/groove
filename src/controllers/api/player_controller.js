import PlatformsManager from '../../utils/platforms_manager.js'

async function setPlayerTrack(req, res) {
  const platform = req.query.platform
  const { tracks, context } = req.body
  const communicator = PlatformsManager.getCommunicator(platform)
  await communicator.setCurrentTracks(req, tracks, context)
  res.send()
}

export { setPlayerTrack }
