import { expect } from 'chai'

import { User, ONG } from '@entities'

import { user } from '../fakes/stubs'

describe('ONG Entity', () => {
  it('Should be able to create a new ONG and be instance from Entity', () => {
    const expected = new ONG(user)

    expect(expected).to.be.instanceOf(User)
  })
})
