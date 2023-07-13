import BaseAuthenticator from '../../../utils/authenticators/base_authenticator.js'
import { expect } from 'chai'

describe('BaseAuthenticator', () => {
  describe('constructor', () => {
    it('should throw an error when instantiated directly', () => {
      expect(() => {
        new BaseAuthenticator() // eslint-disable-line no-new
      }).to.throw(TypeError)
    })
  })

  describe('generateRandomString', () => {
    it('should generate a random string', () => {
      const randomString1 = BaseAuthenticator.generateRandomString(16)
      const randomString2 = BaseAuthenticator.generateRandomString(16)
      expect(randomString1).to.not.equal(randomString2)
    })
  })
})
