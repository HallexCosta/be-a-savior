import { expect } from 'chai'

import { Entity, User } from '@entities'

import { user } from '../fakes/stubs'

describe('Abstract User Entity', () => {
  it('Should be able to create a new User and be instance from Entity', () => {
    class Test extends User<Test> {}

    const expected = new Test(user)

    expect(expected).to.be.instanceOf(Entity)
    expect(expected.id).to.be.lengthOf(36)
  })
})
