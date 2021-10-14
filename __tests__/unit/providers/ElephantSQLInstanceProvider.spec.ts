import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import sinon from 'sinon'

import { ElephantSQLInstanceProvider, Instance, api } from '@providers/elephant/ElephantSQLInstanceProvider'

chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(deepEqualInAnyOrder)

const mockInstances = new Map<string, Instance>([
  [
    'be-a-savior-test', {
      id: 239286,
      name: 'be-a-savior-test',
      plan: 'turtle',
      region: 'amazon-web-services::us-east-1',
      tags: [],
      providerid: 'd2b69142-4088-433c-897e-19225af6c7c2'
    },
  ],
  [
    'be-a-savior-development', {
      id: 239154,
      name: 'be-a-savior-development',
      plan: 'turtle',
      region: 'amazon-web-services::us-east-1',
      tags: [],
      providerid: '9ec59457-c81c-437b-b936-5fc84a60de7c'
    },
  ],
  [
    'be-a-savior-production', {
      id: 239154,
      name: 'be-a-savior-production',
      plan: 'turtle',
      region: 'amazon-web-services::us-east-1',
      tags: [],
      providerid: '9ec59457-c81c-437b-b936-5fc84a60de7c'
    },
  ]
])


describe('#ElephantSQLInstanceProvider', () => {
  let sandbox: sinon.SinonSandbox

  describe('#construct', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should create new instance of ElephantSQLInstanceProvider', () => {
      expect(new ElephantSQLInstanceProvider()).to.be.instanceOf(ElephantSQLInstanceProvider)
    })
  })

  describe('#load', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should load map from instances with all instances in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const mockInstancesRemote = mockInstances.values()
      sandbox.stub(elephantInstanceProvider, 'load').callsFake(async function() {
        for (const instance of mockInstancesRemote) {
          this.instances.set(instance.name, instance)
        }
      })
      await elephantInstanceProvider.load()

      expect(elephantInstanceProvider.instances.size).to.be.greaterThanOrEqual(3)
    })
  })


  describe('#findInMemory', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should find instance in memory', () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()
      sandbox.stub(elephantInstanceProvider, 'instances').value(mockInstances)

      const expectedInstance = elephantInstanceProvider.findInMemory('be-a-savior-test')

      expect(expectedInstance).to.be.equal(elephantInstanceProvider.instances.get('be-a-savior-test'))
    })

    it('should return undefined if not found instance in memory', () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()
      sandbox.stub(elephantInstanceProvider, 'instances').value(mockInstances)

      const expectedInstance = elephantInstanceProvider.findInMemory('return-undefined-instance')

      expect(expectedInstance).to.be.undefined()
    })
  })

  describe('#findInRemote', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should find and return instance by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const instanceName = 'be-a-savior-test'
      const instances = [...mockInstances.values()]
      sandbox.stub(elephantInstanceProvider, 'listInstances').resolves(instances)

      const expectedInstance = await elephantInstanceProvider.findInRemote(instanceName)

      expect(expectedInstance).to.be.equal(instances.find(instance => instance.name === instanceName))
    })

    it('should return undefined if not found instance by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()
      const apiGetStub = sandbox.stub(api, 'get').resolves({
        data: []
      })

      const expectedInstance = await elephantInstanceProvider.findInRemote('return-undefined-instance')

      expect(apiGetStub.calledOnce).to.be.true()
      expect(expectedInstance).to.be.undefined()
    })
  })

  describe('#verifyInstanceExists', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should return true if instance already exists in memory', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      sandbox.stub(elephantInstanceProvider, 'findInRemote').resolves(undefined)
      const findInMemoryStub = sandbox.stub(elephantInstanceProvider, 'findInMemory').returns([...mockInstances.values()][0])

      const instanceName = 'be-a-savior-test'
      const alreadyExists = await elephantInstanceProvider.verifyInstanceExists(instanceName)

      expect(findInMemoryStub.calledOnce).to.be.true()
      expect(findInMemoryStub.calledWith(instanceName)).to.be.true()
      expect(alreadyExists).to.be.true()
    })

    it('should return true if instance already exists in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const findInRemoteStub = sandbox.stub(elephantInstanceProvider, 'findInRemote').resolves([...mockInstances.values()][0])

      const instanceName = 'be-a-savior-test'
      const alreadyExists = await elephantInstanceProvider.verifyInstanceExists(instanceName)

      expect(findInRemoteStub.calledOnce).to.be.true()
      expect(alreadyExists).to.be.true()
    })

    it('should return false if not found instance in memory or remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const findInMemoryStub = sandbox.stub(elephantInstanceProvider, 'findInMemory').returns(undefined)
      const findInRemoteStub = sandbox.stub(elephantInstanceProvider, 'findInRemote').resolves(undefined)

      const alreadyExists = await elephantInstanceProvider.verifyInstanceExists('be-a-savior-test')

      expect(findInMemoryStub.calledOnce).to.be.true()
      expect(findInRemoteStub.calledOnce).to.be.true()
      expect(alreadyExists).to.be.false()
    })
  })

  describe('#findInstanceId', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should find instance id by name in memory', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const mockInstance = [...mockInstances.values()][0]

      sandbox.stub(elephantInstanceProvider, 'findInRemote').resolves(null)
      const findInMemoryStub = sandbox.stub(elephantInstanceProvider, 'findInMemory').returns(mockInstance)
      const instanceId = await elephantInstanceProvider.findInstanceId(mockInstance.name)

      expect(findInMemoryStub.calledOnce).to.be.true()
      expect(instanceId).to.be.equal(mockInstance.id)
    })

    it('should find instance id by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const mockInstance = [...mockInstances.values()][0]
      const findInRemoteStub = sandbox.stub(elephantInstanceProvider, 'findInRemote').resolves(mockInstance)
      const instanceId = await elephantInstanceProvider.findInstanceId(mockInstance.name)

      expect(findInRemoteStub.calledOnce).to.be.true()
      expect(instanceId).to.be.equal(mockInstance.id)

    })

    it('should return null if not found instance id', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      const mockInstance = [...mockInstances.values()][0]
      sandbox.stub(elephantInstanceProvider, 'findInMemory').returns(null)
      sandbox.stub(elephantInstanceProvider, 'findInRemote').returns(null)
      const instanceIdNotFound = await elephantInstanceProvider.findInstanceId(mockInstance.name)

      expect(instanceIdNotFound).to.be.null()
    })
  })

  describe('#createInstance', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('create new instance remote in elephant', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()
      const instance = {
        name: 'this-is-a-new-instance50',
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1',
      }

      sandbox.stub(api, 'get').resolves({
        data: []
      })
      const apiPostStub = sandbox.stub(api, 'post').resolves({
        data: {
          id: 239644,
          message: 'Instance created',
          apikey: 'd6ef6f30-5107-4edb-8da7-6babc2c52742',
          url: 'postgres://zsqkwtxb:UiT8NZVLusnZ3yuYkL8jrURNg5OGTvIV@fanny.db.elephantsql.com/zsqkwtxb'
        }
      })

      const newInstanceCreated = await elephantInstanceProvider.createInstance(instance)

      expect(apiPostStub.calledOnce).to.be.true()
      expect(newInstanceCreated).to.have.property('id')
      expect(newInstanceCreated).to.have.property('message')
      expect(newInstanceCreated).to.have.property('apikey')
      expect(newInstanceCreated).to.have.property('url')
      expect(newInstanceCreated.message).to.be.equal('Instance created')
    })

    it('should thrown an error if already exists an instance with same name in memory', async () => {
      const instance = {
        name: 'be-a-savior-test',
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1',
      }

      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      sandbox.stub(elephantInstanceProvider, 'instances').value(mockInstances)
      sandbox.stub(api, 'get').resolves({ data: [] })

      const toThrow = async () => {
        await elephantInstanceProvider.createInstance(instance)
      }

      await expect(toThrow()).to.be.rejectedWith(Error)
    })

    it('should thrown an error if already exists an instance with same name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()
      const instance = {
        name: 'be-a-savior-test',
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1',
      }

      const mockInstance = [...mockInstances.values()].find(({ name }) => name === instance.name)

      sandbox.stub(api, 'get').resolves({
        data: [mockInstance]
      })

      const toThrow = async () => {
        await elephantInstanceProvider.createInstance(instance)
      }

      await expect(toThrow()).to.be.rejectedWith(Error)
    })
  })

  describe('#deleteInstance', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should delete an instance remote by name', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      sandbox.stub(elephantInstanceProvider, 'instances').value(mockInstances)
      sandbox.stub(elephantInstanceProvider, 'findInstanceId').resolves(123456)
      const apiDeleteStub = sandbox.stub(api, 'delete')

      const deleted = await elephantInstanceProvider.deleteInstance('be-a-savior-test')

      expect(deleted).to.be.true()
      expect(apiDeleteStub.calledOnce).to.be.true()
      expect(elephantInstanceProvider.instances.get('be-a-savior-test')).to.be.undefined()
    })

    it('should return false if instance already deleted', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider()

      sandbox.stub(elephantInstanceProvider, 'findInstanceId').resolves(null)
      const apiDeleteStub = sandbox.stub(api, 'delete').rejects('Request failed with status code 404')


      const deleted = await elephantInstanceProvider.deleteInstance('be-a-savior')

      expect(deleted).to.be.false()
      expect(apiDeleteStub.calledOnce).to.be.true()
    })
  })
})
