import { expect } from 'chai'

import { User, Ong } from '@entities'

describe('ONG Entity', () => {
  it('Should be able to create a new ONG and be instance from Entity', () => {
    const expected = new Ong()

    expect(expected).to.be.instanceOf(User)
  })
})
