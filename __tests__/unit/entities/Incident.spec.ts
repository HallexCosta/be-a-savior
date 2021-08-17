import { expect } from 'chai'

import { BaseEntity } from '@entities/BaseEntity'
import { Incident } from '@entities/Incident'

describe('Incident Entity', () => {
  it('Should be able to create a new Incident without the values of id, created_at, updated_at', () => {
    const expected = new Incident()

    expect(expected).to.be.instanceOf(BaseEntity)
    expect(expected.id).to.be.lengthOf(36)
  })

  it('Should be able to create a new Incident with the values of id, created_at, updated_at', () => {
    const expected = new Incident()

    expect(expected).to.be.instanceOf(BaseEntity)
  })
})
