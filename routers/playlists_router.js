import { getPlaylistTracks } from '../controllers/playlists_controller.js'
import { Router } from 'express'
import requireLogin from '../middleware/require_login.js'
import cacheRequest from '../middleware/cache_request.js'

const router = Router()

router.get('/api/playlists/:playlistId/tracks', [requireLogin, cacheRequest], getPlaylistTracks)

export default router
