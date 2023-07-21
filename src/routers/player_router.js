import { setPlayerTrack, setPlayerShuffle } from '../controllers/api/player_controller.js'
import { Router } from 'express'
import requireLogin from '../middleware/require_login.js'
import cacheRequest from '../middleware/cache_request.js'

const router = Router()

router.post('/api/player/current', [requireLogin, cacheRequest], setPlayerTrack)
router.post('/api/player/shuffle', [requireLogin, cacheRequest], setPlayerShuffle)

export default router
