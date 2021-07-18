import { expect } from 'chai'

import { Entity } from '@entities'

describe('Incident Entity', () => {
  it('Should be able to create a new Entity without the values of id, created_at, updated_at', () => {
    class Teste extends Entity<Teste> {}

    const expected = new Teste({})

    expect(expected).to.be.instanceOf(Entity)
    expect(expected.id).to.be.lengthOf(36)
    expect(expected.created_at).to.be.instanceOf(Date)
    expect(expected.updated_at).to.be.instanceOf(Date)
  })
})
