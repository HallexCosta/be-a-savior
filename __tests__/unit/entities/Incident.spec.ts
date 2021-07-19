import { expect } from 'chai'

import { Entity, Incident } from '@entities'

import { incident } from '../fakes/stubs'

describe('Incident Entity', () => {
  it('Should be able to create a new Incident without the values of id, created_at, updated_at', () => {
    const expected = new Incident({
      name: incident.name,
      coast: incident.coast,
      description: incident.description
    })

    expect(expected).to.be.instanceOf(Entity)
    expect(expected.id).to.be.lengthOf(36)
  })

  it('Should be able to create a new Incident with the values of id, created_at, updated_at', () => {
    const expected = new Incident(incident)

    expect(expected).to.be.instanceOf(Entity)
  })
})
