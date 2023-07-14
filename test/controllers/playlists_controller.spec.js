import { getPlaylistTracks } from '../../controllers/playlists_controller.js'
import PlatformsManager from '../../utils/platforms_manager.js'
import sinon from 'sinon'

describe('PlaylistsController', () => {
  let req
  let res
  let getPlaylistTracksStub
  let mockCommunicator

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    }
    res = {
      send: sinon.stub(),
    }
    getPlaylistTracksStub = sinon.stub()
    mockCommunicator = {
      getPlaylistTracks: getPlaylistTracksStub,
    }
    sinon.stub(PlatformsManager, 'getCommunicator').returns(mockCommunicator)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('getPlaylistTracks', () => {
    it('should return the playlist tracks', async () => {
      req.query.platform = 'spotify'
      req.params.playlistId = '123'
      getPlaylistTracksStub.returns('tracks')

      await getPlaylistTracks(req, res)

      sinon.assert.calledOnce(getPlaylistTracksStub)
      sinon.assert.calledWith(getPlaylistTracksStub, req, '123')
      sinon.assert.calledOnce(res.send)
      sinon.assert.calledWith(res.send, 'tracks')
    })
  })
})
