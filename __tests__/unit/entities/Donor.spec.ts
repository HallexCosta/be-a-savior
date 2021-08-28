import { expect } from 'chai'

import { User } from '@entities/User'
import { Donor } from '@entities/Donor'

describe('Donor Entity', () => {
  it('Should be able to create a new Donor and be instance from Entity', () => {
    const expected = new Donor()

    expect(expected).to.be.instanceOf(User)
  })
})
