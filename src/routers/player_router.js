import { setPlayerTrack } from '../controllers/api/player_controller.js'
import { Router } from 'express'
import requireLogin from '../middleware/require_login.js'
import cacheRequest from '../middleware/cache_request.js'

const router = Router()

router.post('/api/player/current', [requireLogin, cacheRequest], setPlayerTrack)

export default router
