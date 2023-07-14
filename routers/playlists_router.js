import { getPlaylistTracks } from '../controllers/playlists_controller.js'
import { Router } from 'express'
import requireLogin from '../middleware/require_login.js'

const router = Router()

router.get('/api/playlists/:playlistId/tracks', requireLogin, getPlaylistTracks)

export default router
