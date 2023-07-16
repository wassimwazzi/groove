import requireLogin from '../../middleware/require_login.js'
import PlatformsManager from '../../utils/platforms_manager.js'
import sinon from 'sinon'

describe('requireLogin', () => {
  let next
  let res
  let req
  let isLoggedInStub
  let refreshSessionStub
  let authenticatorStub

  beforeEach(() => {
    next = sinon.stub()
    res = {
      redirect: sinon.stub(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    }
    req = {
      query: {},
      flash: sinon.stub(),
      url: '',
    }
    isLoggedInStub = sinon.stub()
    refreshSessionStub = sinon.stub()
    authenticatorStub = {
      isLoggedIn: isLoggedInStub,
      refreshSession: refreshSessionStub,
    }
    sinon.stub(PlatformsManager, 'getAuthenticator').returns(authenticatorStub)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should redirect to homepage if the platform is not selected', async () => {
    await requireLogin(req, res, next)

    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(next)
  })

  it('should redirect to homepage if the user is not logged in', async () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(false)
    refreshSessionStub.returns(false)

    await requireLogin(req, res, next)

    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(next)
  })

  it('should return 401 if the user is not logged in and the request is an API request', async () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(false)
    req.url = '/api/playlists'

    await requireLogin(req, res, next)

    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
    sinon.assert.calledOnce(res.status)
    sinon.assert.calledWith(res.status, 401)
    sinon.assert.calledOnce(res.send)
    sinon.assert.calledWith(res.send, { error: 'Connect to one of the platforms first' })
    sinon.assert.notCalled(next)
  })

  it('should call next if the user is logged in', async () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(true)

    await requireLogin(req, res, next)

    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
    sinon.assert.calledOnce(next)
  })

  it('should call next if the user is not logged in but the session is refreshed', async () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(false)
    refreshSessionStub.returns(true)

    await requireLogin(req, res, next)

    sinon.assert.calledOnce(refreshSessionStub)
    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
    sinon.assert.calledOnce(next)
  })
})
