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
  const defaultFunction = () => { }
  let mocks = createMocks({
    pureMock: {
      user: true
    }
  })
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
        findOwnerById: defaultFunction,
        findByEmail: defaultFunction,
        findByPhone: defaultFunction
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

  describe('#executeUser', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should authenticate user by email and return token signed', async () => {
      const findByEmailStub = sandbox
        .stub(authenticateUserServiceMock.repositories.users, 'findByEmail')
        .resolves({
          ...mocks.user,
          password: 'hallex123'
        })

      const findByPhoneStub = sandbox
        .stub(authenticateUserServiceMock.repositories.users, 'findByPhone')
        .resolves()

      const tokenMock = '$2a$08$WsGdl5YnDjMhobv1VUGX4uSUE.GTe4BrhmdgJqBLGu.CjuuIVxeZK'
      const signTokenStub = sandbox
        .stub(authenticateUserServiceMock, 'signToken')
        .returns(tokenMock)

      const checkUserExistsStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserExists')
        .callsFake(defaultFunction)

      const checkUserPasswordIsValidStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserPasswordIsValid')
        .callsFake(async (..._: string[]) => { })

      const checkUserHaveAccessThisOwnerStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserHaveAccessThisOwner')
        .callsFake(defaultFunction)

      const token = await authenticateUserServiceMock.executeUser({
        dto: mocks.user
      })

      expect(findByEmailStub.calledOnce).to.be.true()
      expect(findByPhoneStub.calledOnce).to.be.false()
      expect(checkUserExistsStub.calledOnce).to.be.true()
      expect(checkUserPasswordIsValidStub.calledOnce).to.be.true()
      expect(checkUserHaveAccessThisOwnerStub.calledOnce).to.be.true()
      expect(signTokenStub.calledOnce).to.be.true()
      expect(token.length).to.be.greaterThanOrEqual(10)
    })


    it('should authenticate user by phone and return token signed', async () => {
      const findByEmailStub = sandbox
        .stub(authenticateUserServiceMock.repositories.users, 'findByEmail')
        .resolves()

      const findByPhoneStub = sandbox
        .stub(authenticateUserServiceMock.repositories.users, 'findByPhone')
        .resolves({
          ...mocks.user,
          password: 'hallex123'
        })

      const tokenMock = '$2a$08$WsGdl5YnDjMhobv1VUGX4uSUE.GTe4BrhmdgJqBLGu.CjuuIVxeZK'
      const signTokenStub = sandbox
        .stub(authenticateUserServiceMock, 'signToken')
        .returns(tokenMock)

      const checkUserExistsStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserExists')
        .callsFake(defaultFunction)

      const checkUserPasswordIsValidStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserPasswordIsValid')
        .callsFake(async (..._: string[]) => { })

      const checkUserHaveAccessThisOwnerStub = sandbox
        .stub(authenticateUserServiceMock, 'checkUserHaveAccessThisOwner')
        .callsFake(defaultFunction)

      const token = await authenticateUserServiceMock.executeUser({
        dto: mocks.user
      })

      expect(findByEmailStub.calledOnce).to.be.true()
      expect(findByPhoneStub.calledOnce).to.be.true()
      expect(checkUserExistsStub.calledOnce).to.be.true()
      expect(checkUserPasswordIsValidStub.calledOnce).to.be.true()
      expect(checkUserHaveAccessThisOwnerStub.calledOnce).to.be.true()
      expect(signTokenStub.calledOnce).to.be.true()
      expect(token.length).to.be.greaterThanOrEqual(10)
    })
  })

  describe('#checkUserHaveAccessThisOwner', () => {
    it("should be throw an error if user haven't owner request by service", () => {
      const toThrow = () => {
        authenticateUserServiceMock
          .checkUserHaveAccessThisOwner('ong', 'donor')
      }

      expect(toThrow).to.throw(/This user/gi)
    })

    it('Should not do anything if the user has the owner request for the service', () => {
      const toThrow = () => {
        authenticateUserServiceMock
          .checkUserHaveAccessThisOwner('ong', 'ong')
      }

      expect(toThrow).not.to.throw()
    })
  })

  describe('#signToken', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be sign and return token with user', () => {
      const { user } = mocks

      const token = authenticateUserServiceMock.signToken(user)
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
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be able throw error if not find user', () => {
      const toThrow = () => {
        const user = undefined
        authenticateUserServiceMock.checkUserExists(user)
      }

      expect(toThrow).to.throw(/incorrect/gi)
    })

    it('should be able not throw error if user exists', () => {
      const toThrow = () => {
        authenticateUserServiceMock.checkUserExists(mocks.user)
      }

      expect(toThrow).not.to.throw()
    })
  })

  describe('#checkUserPasswordIsValid', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be able throw error if user password is invalid', async () => {
      const userRepositoryPasswordMocked = '$2a$08$lrkeJHykB/qfgKjHUz85We.zcahLZGu.XF5FzmxhYyUcIbxvKbTaG'
      const userPasswordMocked = 'hallex123'

      const toThrow = async () => {
        await authenticateUserServiceMock.checkUserPasswordIsValid(
          userPasswordMocked,
          userRepositoryPasswordMocked
        )
      }

      await expect(toThrow()).to.rejectedWith(/incorrect/gi)
    })
  })
})
