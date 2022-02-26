import bcrypt from 'bcryptjs'
import { expect } from 'chai'
import sinon from 'sinon'

import { createMocks, BeASaviorMocks } from '@tests/fakes/mocks'
import { CreateUserService, CreateUserDTO } from '@services/users/CreateUserService'
import { UsersRepository } from '@repositories/UsersRepository'

describe('@CreateUserService', () => {
  let mocks: BeASaviorMocks
  let sandbox: sinon.SinonSandbox
  let defaultFunction = () => { }
  let createUserServiceMock: CreateUserService

  describe('#constructor', () => {
    beforeEach(() => {
      mocks = createMocks()
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be extend abstract create user service and instance new object', () => {
      class CreateUserServiceMock extends CreateUserService { }

      const usersRepository = {
        save: defaultFunction,
        create: () => mocks.user,
        findByEmail: defaultFunction,
        checkForUserEmailExists: defaultFunction,
        encryptPassword: defaultFunction
      } as unknown as UsersRepository

      createUserServiceMock = new CreateUserServiceMock({
        repositories: {
          users: usersRepository
        }
      })

      expect(createUserServiceMock).to.be.instanceOf(CreateUserService)
    })
  })

  describe('#executeUser', () => {
    beforeEach(() => {
      mocks = createMocks()
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be create user and save in database and return user data', async () => {
      const checkForUserEmailExistsMock = sandbox.stub(createUserServiceMock, 'checkForUserEmailExists').resolves()
      const checkForFieldIsFilledMock = sandbox.stub(createUserServiceMock, 'checkForFieldIsFilled').resolves()
      const encryptPasswordMock = sandbox.stub(createUserServiceMock, 'encryptPassword').resolves()

      const user = await createUserServiceMock.executeUser({
        dto: mocks.user
      })

      expect(checkForUserEmailExistsMock.calledOnce).to.be.true()
      expect(checkForFieldIsFilledMock.calledOnce).to.be.true()
      expect(encryptPasswordMock.calledOnce).to.be.true()

      expect(user).to.not.have.property('password')
      expect(user).to.have.property('id')
      expect(user).to.have.property('name')
      expect(user).to.have.property('email')
      expect(user).to.have.property('phone')
      expect(user).to.have.property('created_at')
      expect(user).to.have.property('updated_at')
    })
  })

  describe('#encryptPassword', () => {
    beforeEach(() => {
      mocks = createMocks()
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be encrypt password with bcrypt 8 bytes', async () => {
      const passwordHashMock = '$2a$08$ZCIzjohIGgbL3IlZcLEtT.1zrciBRd9AmeASp3E36JX6vW/eBElkq'

      const hashStub = sandbox.stub(bcrypt, 'hash').resolves(passwordHashMock)

      const password = 'hallex123'
      const passwordHash = await createUserServiceMock.encryptPassword(password)

      expect(passwordHash.split('$').length).to.be.greaterThanOrEqual(passwordHashMock.split('$').length)
      expect(hashStub.calledOnce).to.be.true()
    })
  })

  describe('#checkForUserEmailExists', () => {
    beforeEach(() => {
      mocks = createMocks()
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be throw error if user email already in use', async () => {
      const usersRepository = {
        findByEmail: defaultFunction
      }
      sandbox.stub(usersRepository, 'findByEmail').resolves(mocks.ong)

      const toThrow = async () => {
        await createUserServiceMock.checkForUserEmailExists(mocks.ong.email, usersRepository)
      }

      await expect(toThrow()).to.be.rejectedWith(Error)
    })

    it('do not do anything if user not use this email ', async () => {
      const usersRepository = {
        findByEmail: defaultFunction
      }
      const checkForUserEmailExistsStub = sandbox.stub(usersRepository, 'findByEmail').resolves()

      await createUserServiceMock.checkForUserEmailExists(mocks.ong.email, usersRepository)

      expect(checkForUserEmailExistsStub.calledOnce).to.be.true()
    })
  })


  describe('#checkForFieldIsFilled', () => {
    beforeEach(() => {
      mocks = createMocks()
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should be throw error if "name" is undefined or null', async () => {
      const toThrow = () => {
        createUserServiceMock.checkForFieldIsFilled({} as CreateUserDTO)
      }

      expect(toThrow).to.throw(/name/gi)
    })

    it('should be throw error if "email" is undefined or null', async () => {
      const toThrow = () => {
        createUserServiceMock.checkForFieldIsFilled({
          ...mocks.ong,
          email: undefined
        })
      }

      expect(toThrow).to.throw(/email/gi)
    })

    it('should be throw error if "password" is undefined or null', async () => {
      const toThrow = () => {
        createUserServiceMock.checkForFieldIsFilled({
          ...mocks.ong,
          password: undefined
        })
      }

      expect(toThrow).to.throw(/password/gi)
    })

    it('should be throw error if "phone" is undefined or null', async () => {
      const toThrow = () => {
        createUserServiceMock.checkForFieldIsFilled({
          ...mocks.ong,
          phone: undefined
        })
      }

      expect(toThrow).to.throw(/phone/gi)
    })

    it('should be throw error if "owner" is undefined or null', async () => {
      const toThrow = () => {
        createUserServiceMock.checkForFieldIsFilled({
          ...mocks.ong,
          owner: undefined
        })
      }

      expect(toThrow).to.throw(/owner/gi)
    })
  })
})
