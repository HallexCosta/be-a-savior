import { expect } from 'chai'

import { BaseEntity, User } from '@entities'

describe('Abstract User Entity', () => {
  it('Should be able to create a new User and be instance from Entity', () => {
    class Test extends User {}

    const expected = new Test()

    expect(expected).to.be.instanceOf(BaseEntity)
    expect(expected.id).to.be.lengthOf(36)
  })
})
