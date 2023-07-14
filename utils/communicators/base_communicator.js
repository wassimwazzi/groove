/**
 * absract Base communicator class.
 * Used to communicate with 3rd party music platforms.
 *
 * @class BaseCommunicator
 * @abstract
 */
class BaseCommunicator {
  constructor() {
    if (this.constructor === BaseCommunicator) {
      throw new TypeError('Abstract class "BaseCommunicator" cannot be instantiated directly.')
    }
  }

  /**
   * Gets all the playlists of the user.
   *
   * @param {Object} _req - The request object.
   * @returns {Object} The playlists of the user.
   * @abstract
   * @memberof BaseCommunicator
   * @instance
   * @function getPlaylists
   * @throws {TypeError} - If the method is not implemented.
   */
  getPlaylists(_req) {
    throw new TypeError('getPlaylists method must be implemented.')
  }

  /**
   * Gets all the tracks of a playlist.
   *
   * @param {Object} _req - The request object.
   * @param {string} _playlistId - The id of the playlist.
   * @returns {Object} The tracks of the playlist.
   * @abstract
   * @memberof BaseCommunicator
   * @instance
   * @function getPlaylistTracks
   * @throws {TypeError} - If the method is not implemented.
   */
  getPlaylistTracks(_req, _playlistId) {
    throw new TypeError('getTracks method must be implemented.')
  }

  /**
   * Add tracks to a playlist.
   *
   * @param {Object} _req - The request object.
   * @param {string} _playlistId - The id of the playlist.
   * @param {Array} _tracks - The tracks to add to the playlist.
   * @abstract
   * @memberof BaseCommunicator
   * @instance
   * @function addTracks
   * @throws {TypeError} - If the method is not implemented.
   */
  addTracks(_req, _playlistId, _tracks) {
    throw new TypeError('addTracks method must be implemented.')
  }
}

export default BaseCommunicator
