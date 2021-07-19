import { expect } from 'chai'

import { User, Donor } from '@entities'

import { user } from '../fakes/stubs'

describe('Donor Entity', () => {
  it('Should be able to create a new Donor and be instance from Entity', () => {
    const expected = new Donor(user)

    expect(expected).to.be.instanceOf(User)
  })
})
