import { expect } from 'chai'
import sinon from 'sinon'

import * as typeorm from 'typeorm'

import { createMocks } from '@tests/fakes/mocks'
import { ListUsersService, ListUsersServiceDependencies } from '@services/users/ListUsersService'
import { UsersRepository } from '@repositories/UsersRepository'

describe('@ListUsersService', () => {
  let sandbox: sinon.SinonSandbox
  let listUsersServiceMock: ListUsersService

  describe('#constructor', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be extend abstract list users service and instance new object', () => {
      class ListUsersServiceMock extends ListUsersService {
        constructor(mockDependencies: ListUsersServiceDependencies) {
          super(mockDependencies)
        }
      }

      const usersRepository = {
        findByOwner: (owner: string) => {
          const users = []

          Array.from(Array(5).keys(), id => {
            const donor = createMocks().donor
            const ong = createMocks().ong

            users.push(id == 0 ? { ...ong, id: id.toString(), owner: 'testing-owner' } : ong)
            users.push(id == 0 ? { ...donor, id: id.toString() } : donor)
          })

          return users.filter(user => {
            return user.owner.includes(owner)
          })
        }
      }

      sandbox.stub(typeorm, 'getCustomRepository').returns(usersRepository)

      const dependencies = {
        repositories: {
          users: typeorm.getCustomRepository(UsersRepository)
        }
      }
      listUsersServiceMock = new ListUsersServiceMock(dependencies)

      expect(listUsersServiceMock).to.be.instanceOf(ListUsersServiceMock)
    })
  })

  describe('#executeUser', () => {
    it('should be list users owner', async () => {
      const findByOwnerSpy = sinon.spy(
        listUsersServiceMock.repositories.users,
        'findByOwner'
      )

      const users = await listUsersServiceMock.executeUser({
        dto: {
          owner: 'testing-owner'
        }
      })
      expect(findByOwnerSpy.calledOnce).to.be.true()
      expect(users).to.be.lengthOf(1)
    })
  })
})
