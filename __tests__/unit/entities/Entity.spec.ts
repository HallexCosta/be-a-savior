import { expect } from 'chai'

import { BaseEntity } from '@entities/BaseEntity'

describe('Abstract Entity', () => {
  it('Should be able to create a new Entity without the values of id, created_at, updated_at', () => {
    class Teste extends BaseEntity {}

    const expected = new Teste()

    expect(expected).to.be.instanceOf(BaseEntity)
    expect(expected.id).to.be.lengthOf(36)
    expect(expected.created_at).to.be.instanceOf(Date)
    expect(expected.updated_at).to.be.instanceOf(Date)
  })
})
