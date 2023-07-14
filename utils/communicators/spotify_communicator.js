import SpotifyWebApi from 'spotify-web-api-node'
import BaseCommunicator from './base_communicator.js'

/**
 * Communicator for Spotify API
 */
export default class SpotifyCommunicator extends BaseCommunicator {
  constructor() {
    super()
    this.spotifyApi = new SpotifyWebApi()
  }

  /**
   * Set the access token for the Spotify API.
   * @param {string} accessToken - The access token.
   */
  setAccessToken(accessToken) {
    this.spotifyApi.setAccessToken(accessToken)
  }

  /**
   * Gets all the playlists of the user.
   * @param {Object} req - The request object.
   * @returns {Object} The playlists of the user.
   * @memberof SpotifyCommunicator
   * @instance
   * @function getPlaylists
   */
  async getPlaylists(req) {
    this.spotifyApi.setAccessToken(req.session.spotifyAccessToken)
    const data = await this.spotifyApi.getUserPlaylists()
    return data.body.items
  }

  /**
   * Gets all the tracks of a playlist.
   * @param {Object} req - The request object.
   * @param {string} playlistId - The id of the playlist.
   * @returns {Object} The tracks of the playlist.
   * @memberof SpotifyCommunicator
   * @instance
   * @function getPlaylistTracks
   */
  async getPlaylistTracks(req, playlistId) {
    this.spotifyApi.setAccessToken(req.session.spotifyAccessToken)
    const data = await this.spotifyApi.getPlaylistTracks(playlistId)
    return data.body.items
  }
}
