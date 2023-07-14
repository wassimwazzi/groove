import sinon from 'sinon'
import PlatformsManager from '../../utils/platforms_manager.js'
import dashboardController from '../../controllers/dashboard_controller.js'

describe('authController', () => {
  let req
  let res
  let isLoggedInStub
  let getPlaylistsStub
  let getAuthenticatorStub
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

    isLoggedInStub = sinon.stub()
    getPlaylistsStub = sinon.stub()
    getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
      isLoggedIn: isLoggedInStub,
    })
    getCommunicatorStub = sinon.stub(PlatformsManager, 'getCommunicator').returns({
      getPlaylists: getPlaylistsStub,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should redirect if the user is not logged in', async () => {
    isLoggedInStub.returns(false)

    await dashboardController(req, res)

    sinon.assert.calledOnce(getAuthenticatorStub)
    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(res.render)
  })

  it('should render the dashboard if the user is logged in', async () => {
    isLoggedInStub.returns(true)

    await dashboardController(req, res)

    sinon.assert.calledOnce(getAuthenticatorStub)
    sinon.assert.calledOnce(res.render)
    sinon.assert.calledWithMatch(res.render, 'dashboard', { platform: 'Spotify' })
    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
  })

  it('should get the playlists if the user is logged in', async () => {
    isLoggedInStub.returns(true)
    getPlaylistsStub.returns([])

    await dashboardController(req, res)

    sinon.assert.calledOnce(getCommunicatorStub)
    sinon.assert.calledOnce(res.render)
    sinon.assert.calledWith(res.render, 'dashboard', { platform: 'Spotify', playlists: [] })
  })

  it('should not get the playlists if the user is not logged in', async () => {
    isLoggedInStub.returns(false)

    await dashboardController(req, res)

    sinon.assert.notCalled(getCommunicatorStub)
    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
  })
})
