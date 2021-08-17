import { expect } from 'chai'

import { User } from '@entities/User'
import { Ong } from '@entities/Ong'

describe('ONG Entity', () => {
  it('Should be able to create a new ONG and be instance from Entity', () => {
    const expected = new Ong()

    expect(expected).to.be.instanceOf(User)
  })
})
