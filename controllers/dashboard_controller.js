// import { getData } from '../utils/get_data.js'
import PlatformsManager from '../utils/platforms_manager.js'

export default async (req, res) => {
  const LoggedInPlatforms = PlatformsManager.getLoggedInPlatforms(req)
  if (LoggedInPlatforms.length < 1) {
    res.redirect('/')
    return
  }
  res.render('dashboard', { platforms: LoggedInPlatforms })
}
