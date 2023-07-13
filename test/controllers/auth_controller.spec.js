import sinon from 'sinon'
import PlatformsManager from '../../utils/platforms_manager.js'
import { login, callback } from '../../controllers/auth_controller.js'

describe('authController', () => {
  let req
  let res
  let loginStub

  beforeEach(() => {
    req = { query: { platform: 'spotify' }, flash: sinon.stub() }
    res = {
      redirect: sinon.stub(),
      render: sinon.stub(),
    }
    loginStub = sinon.stub()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('login', () => {
    it('should redirect to the authenticator login page', () => {
      const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
        login: loginStub,
      })

      login(req, res)

      sinon.assert.calledOnce(getAuthenticatorStub)
      sinon.assert.calledOnce(loginStub)
      sinon.assert.calledWith(loginStub, req, res)
      sinon.assert.notCalled(res.render)
      sinon.assert.notCalled(res.redirect)
    })
  })

  describe('callback', () => {
    it('should redirect to the dashboard if the login was successful', () => {
      const callbackStub = sinon.stub()
      const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
        callback: callbackStub,
      })

      callbackStub.callsArg(2)

      callback(req, res)

      sinon.assert.calledOnce(getAuthenticatorStub)
      sinon.assert.calledOnce(callbackStub)
      sinon.assert.calledWith(callbackStub, req, res)
      sinon.assert.calledOnce(res.redirect)
      sinon.assert.calledWith(res.redirect, '/dashboard?platform=spotify')
      sinon.assert.notCalled(res.render)
      sinon.assert.calledOnce(req.flash)
      sinon.assert.calledWith(req.flash, 'notice')
    })

    it('should redirect to the home page if the login was not successful', () => {
      const callbackStub = sinon.stub()
      const getAuthenticatorStub = sinon.stub(PlatformsManager, 'getAuthenticator').returns({
        callback: callbackStub,
      })

      callbackStub.callsArgWith(3, 'error')

      callback(req, res)

      sinon.assert.calledOnce(getAuthenticatorStub)
      sinon.assert.calledOnce(callbackStub)
      sinon.assert.calledWith(callbackStub, req, res)
      sinon.assert.calledOnce(res.redirect)
      sinon.assert.calledWith(res.redirect, '/')
      sinon.assert.notCalled(res.render)
      sinon.assert.calledOnce(req.flash)
      sinon.assert.calledWith(req.flash, 'error', 'error')
    })
  })
})
