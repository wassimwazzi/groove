import SpotifyWebApi from 'spotify-web-api-node'
import SpotifyCommunicator from '../../../utils/communicators/spotify_communicator.js'
import { expect } from 'chai'
import sinon from 'sinon'

describe('SpotifyCommunicator', () => {
  let req = { session: { spotifyAccessToken: 'access_token' } }

  describe('constructor', () => {
    it('should create a SpotifyCommunicator instance', () => {
      const spotifyCommunicator = new SpotifyCommunicator()
      expect(spotifyCommunicator).to.be.instanceOf(SpotifyCommunicator)
    })
  })

  describe('setAccessToken', () => {
    it('should set the access token', () => {
      const spotifyCommunicator = new SpotifyCommunicator()
      const setAccessTokenStub = sinon.stub(SpotifyWebApi.prototype, 'setAccessToken')
      spotifyCommunicator.setAccessToken('access_token')
      sinon.assert.calledOnce(setAccessTokenStub)
      sinon.assert.calledWith(setAccessTokenStub, 'access_token')
    })
  })

  describe('getPlaylists', () => {
    it('should get the playlists', async () => {
      const spotifyCommunicator = new SpotifyCommunicator()
      const getUserPlaylistsStub = sinon.stub(SpotifyWebApi.prototype, 'getUserPlaylists').returns({
        body: { items: ['playlist1', 'playlist2'] },
      })
      const playlists = await spotifyCommunicator.getPlaylists(req)
      sinon.assert.calledOnce(getUserPlaylistsStub)
      sinon.assert.calledWith(getUserPlaylistsStub)
      expect(playlists).to.deep.equal(['playlist1', 'playlist2'])
    })
  })

  describe('getTracks', () => {
    it('should get the tracks', async () => {
      const spotifyCommunicator = new SpotifyCommunicator()
      const getPlaylistTracksStub = sinon.stub(SpotifyWebApi.prototype, 'getPlaylistTracks').returns({
        body: { items: ['track1', 'track2'] },
      })
      const tracks = await spotifyCommunicator.getPlaylistTracks(req, 'playlistId')
      sinon.assert.calledOnce(getPlaylistTracksStub)
      sinon.assert.calledWith(getPlaylistTracksStub, 'playlistId')
      expect(tracks).to.deep.equal(['track1', 'track2'])
    })
  })
})
