import sinon from 'sinon'
import PlatformsManager from '../../utils/platforms_manager.js'
import dashboardController from '../../controllers/dashboard_controller.js'

describe('dashboardController', () => {
  let req
  let res
  let getPlaylistsStub
  let getCommunicatorStub

  beforeEach(() => {
    req = {
      query: { platform: 'spotify' },
      flash: sinon.stub(),
      session: {
        spotifyAccessToken: 'spotifyAccessToken',
      },
    }
    res = {
      redirect: sinon.stub(),
      render: sinon.stub(),
    }

    getPlaylistsStub = sinon.stub()
    getCommunicatorStub = sinon.stub(PlatformsManager, 'getCommunicator').returns({
      getPlaylists: getPlaylistsStub,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should render the dashboard', async () => {
    await dashboardController(req, res)

    sinon.assert.calledOnce(res.render)
    sinon.assert.calledWithMatch(res.render, 'dashboard', { platform: 'spotify' })
    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
  })

  it('should get the playlists', async () => {
    getPlaylistsStub.returns([])

    await dashboardController(req, res)

    sinon.assert.calledOnce(getCommunicatorStub)
    sinon.assert.calledOnce(res.render)
    sinon.assert.calledWith(res.render, 'dashboard', { platform: 'spotify', playlists: [] })
  })
})
