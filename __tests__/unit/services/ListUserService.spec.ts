import { expect } from 'chai'
import sinon from 'sinon'

import * as typeorm from 'typeorm'

import { createMocks } from '@tests/fakes/mocks'
import { ListUserService } from '@services/users/ListUserService'
import { UsersRepository } from '@repositories/UsersRepository'

describe('@ListUserService', () => {
  let sandbox: sinon.SinonSandbox
  let listUserServiceMock: ListUserService

  describe('#constructor', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be extend abstract list user service and instance new object', () => {
      class ListUserServiceMock extends ListUserService { }

      const usersRepository = {
        findOwnerById: (id: string, owner: string) => {
          const users = []

          Array.from(Array(5).keys(), id => {
            const donor = createMocks().donor
            const ong = createMocks().ong

            users.push(id == 0 ? { ...ong, id: id.toString(), owner: 'testing-owner' } : ong)
            users.push(id == 0 ? { ...donor, id: id.toString() } : donor)
          })

          return users.filter(user => {
            return user.owner.includes(owner) && user.id == id
          })
        }
      }

      sandbox.stub(typeorm, 'getCustomRepository').returns(usersRepository)

      const dependencies = {
        repositories: {
          users: typeorm.getCustomRepository(UsersRepository)
        }
      }
      listUserServiceMock = new ListUserServiceMock(dependencies)

      expect(listUserServiceMock).to.be.instanceOf(ListUserServiceMock)
    })
  })

  describe('#executeUser', () => {
    it('should be list user by id and owner', async () => {
      const findOwnerByIdSpy = sinon.spy(
        listUserServiceMock.repositories.users,
        'findOwnerById'
      )

      const users = await listUserServiceMock.executeUser({
        dto: {
          id: '0',
          owner: 'testing-owner'
        }
      })
      expect(findOwnerByIdSpy.calledOnce).to.be.true()
      expect(users).to.be.lengthOf(1)
    })
  })
})
