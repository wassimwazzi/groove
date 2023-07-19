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

  /**
   * Sets the current tracks of the player.
   * @param {Object} req - The request object.
   * @param {Array} tracks - The tracks to set.
   * @param {string} context - The context of the tracks.
   * @memberof SpotifyCommunicator
   * @instance
   * @function setCurrentTracks
   */
  async setCurrentTracks(req, tracks, context) {
    this.spotifyApi.setAccessToken(req.session.spotifyAccessToken)
    if (tracks.length > 0 && context) {
      const offset = { uri: tracks[0] }
      await this.spotifyApi.play({ context_uri: context, offset })
    } else if (tracks.length > 0) {
      console.log('tracks provided')
      await this.spotifyApi.play({ uris: tracks })
    } else if (context) {
      console.log('context provided')
      await this.spotifyApi.play({ context_uri: context })
    } else {
      console.log('No tracks or context provided')
    }
  }
}
