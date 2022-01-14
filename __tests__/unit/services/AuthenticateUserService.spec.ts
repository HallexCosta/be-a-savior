import * as typeorm from 'typeorm'
import { expect } from 'chai'
import sinon from 'sinon'

import { createMocks } from '@tests/fakes/mocks'
import { Util } from '@tests/util'

import {
  AuthenticateUserService,
  AuthenticateUserParams,
} from '@services/users/AuthenticateUserService'

import { UsersRepository } from '@repositories/UsersRepository'

describe('@AuthenticateUserService', () => {
  let mocks = createMocks()
  let sandbox: sinon.SinonSandbox
  let authenticateUserServiceMock: AuthenticateUserService

  describe('#constructor', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be extend abstract authenticate user service and instance new object', () => {
      class AuthenticateUserServiceMock extends AuthenticateUserService {
        public constructor(authenticateUserParams: AuthenticateUserParams) {
          super(authenticateUserParams)
        }
      }

      const usersRepository = {
        findOwnerById: () => { },
        findByEmail: () => { },
        findByPhone: () => { }
      }

      sandbox.stub(typeorm, 'getCustomRepository').returns(usersRepository)

      const dependencies = {
        repositories: {
          users: typeorm.getCustomRepository(UsersRepository)
        }
      }
      authenticateUserServiceMock = new AuthenticateUserServiceMock(dependencies)

      expect(authenticateUserServiceMock).to.be.instanceOf(AuthenticateUserServiceMock)
    })
  })

  describe('#signToken', () => {
    it('should be sign and return token with user', () => {
      const { user } = mocks

      const token = authenticateUserServiceMock.signToken<string>(user)
      const tokenDecrypted = Util.decryptJWTToken(token)

      const tokenParsed = JSON.parse(tokenDecrypted)

      expect(tokenParsed).to.not.have.property('password')
      expect(tokenParsed).to.have.property('id')
      expect(tokenParsed).to.have.property('name')
      expect(tokenParsed).to.have.property('email')
      expect(tokenParsed).to.have.property('phone')
      expect(tokenParsed).to.have.property('created_at')
      expect(tokenParsed).to.have.property('updated_at')
    })
  })

  describe('#checkUserExists', () => {
    it('should be able throw error if not find user', async () => {
      //const findByPhoneStub = sandbox.stub(authenticateUserServiceMock.repositories.users, 'findByPhone').resolves({
      //  ...mocks.user,
      //  email: 'user@example.com',
      //  phone: '123456'
      //})

      const toThrow = () => {
        const user = undefined
        authenticateUserServiceMock.checkUserExists(user)
      }

      expect(toThrow).to.throw(/incorrect/gi)
      //expect(findByPhoneStub.calledOnce).to.be.false()
    })
  })
})
