import BaseCommunicator from '../../../utils/communicators/base_communicator.js'
import { expect } from 'chai'

describe('BaseCommunicator', () => {
  it('cannot be instantiated', () => {
    expect(() => {
      new BaseCommunicator()
    }).to.throw(TypeError, 'Abstract class')
  })
})
