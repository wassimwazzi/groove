import requireLogin from '../../middleware/require_login.js'
import PlatformsManager from '../../utils/platforms_manager.js'
import sinon from 'sinon'

describe('requireLogin', () => {
  const next = sinon.stub()
  let res
  let req
  let isLoggedInStub

  beforeEach(() => {
    res = {
      redirect: sinon.stub(),
    }
    req = {
      query: {},
      flash: sinon.stub(),
    }
    isLoggedInStub = sinon.stub()
    sinon.stub(PlatformsManager, 'getAuthenticator').returns({
      isLoggedIn: isLoggedInStub,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should redirect to homepage if the platform is not selected', () => {
    requireLogin(req, res, next)

    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(next)
  })

  it('should redirect to homepage if the user is not logged in', () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(false)

    requireLogin(req, res, next)

    sinon.assert.calledOnce(res.redirect)
    sinon.assert.calledWith(res.redirect, '/')
    sinon.assert.calledOnce(req.flash)
    sinon.assert.notCalled(next)
  })

  it('should call next if the user is logged in', () => {
    req.query.platform = 'spotify'
    isLoggedInStub.returns(true)

    requireLogin(req, res, next)

    sinon.assert.notCalled(res.redirect)
    sinon.assert.notCalled(req.flash)
    sinon.assert.calledOnce(next)
  })
})
