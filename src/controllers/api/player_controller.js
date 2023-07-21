import PlatformsManager from '../../utils/platforms_manager.js'

async function setPlayerTrack(req, res) {
  const platform = req.query.platform
  const { tracks, context } = req.body
  const communicator = PlatformsManager.getCommunicator(platform)
  await communicator.setCurrentTracks(req, tracks, context)
  res.send()
}

async function setPlayerShuffle(req, res) {
  const platform = req.query.platform
  const { shuffle } = req.body
  const communicator = PlatformsManager.getCommunicator(platform)
  await communicator.setShuffle(req, shuffle)
  res.send()
}

export { setPlayerTrack, setPlayerShuffle }
