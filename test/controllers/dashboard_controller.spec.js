import sinon from 'sinon'
import PlatformsManager from '../../utils/platforms_manager.js'
import dashboardController from '../../controllers/dashboard_controller.js'

describe('authController', () => {
  let req
  let res
  let isLoggedInStub

  beforeEach(() => {
    req = { query: { platform: 'spotify' }, flash: sinon.stub() }
    res = {
      redirect: sinon.stub(),
      render: sinon.stub(),
    }

    isLoggedInStub = sinon.stub()
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should redirect if the user is not logged in', async () => {
    const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
      isLoggedIn: isLoggedInStub,
    })

    isLoggedInStub.returns(false)

    await dashboardController(req, res)

    sinon.assert.calledOnce(getAuthenticatorStub)
    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(res.render)
  })

  it('should render the dashboard if the user is logged in', async () => {
    const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
      isLoggedIn: isLoggedInStub,
    })

    isLoggedInStub.returns(true)

    await dashboardController(req, res)

    sinon.assert.calledOnce(getAuthenticatorStub)
    sinon.assert.calledOnce(res.render)
    sinon.assert.calledWith(res.render, 'dashboard', { platform: 'Spotify' })
    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
  })
})
