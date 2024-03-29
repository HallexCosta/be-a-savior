import chai, { expect } from 'chai'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import sinon from 'sinon'

import { ElephantSQLInstanceProvider, InstanceDetail, api } from '@providers/elephant/ElephantSQLInstanceProvider'

chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(deepEqualInAnyOrder)

const mockInstances = new Map<string, InstanceDetail>([
  [
    'be-a-savior-test', {
      id: 239286,
      name: 'be-a-savior-test',
      plan: 'turtle',
      url: 'postgres://gxzxslmv:B3FamoI_FTyur7w9wrbMiP04BK-zwMRW@fanny.db.elephantsql.com/gxzxslmv',
      region: 'amazon-web-services::us-east-1',
      providerid: 'd2b69142-4088-433c-897e-19225af6c7c2',
      apikey: '1135e7d8-087b-4451-828a-b3fcf3161669'
    },
  ],
  [
    'be-a-savior-development', {
      id: 239154,
      name: 'be-a-savior-development',
      plan: 'turtle',
      url: 'postgres://gxzxslmv:B3FamoI_FTyur7w9wrbMiP04BK-zwMRW@fanny.db.elephantsql.com/gxzxslmv',
      region: 'amazon-web-services::us-east-1',
      providerid: '9ec59457-c81c-437b-b936-5fc84a60de7c',
      apikey: '1135e7d8-087b-4451-828a-b3fcf3161669'
    },
  ],
  [
    'be-a-savior-production', {
      id: 239154,
      name: 'be-a-savior-production',
      plan: 'turtle',
      url: 'postgres://gxzxslmv:B3FamoI_FTyur7w9wrbMiP04BK-zwMRW@fanny.db.elephantsql.com/gxzxslmv',
      region: 'amazon-web-services::us-east-1',
      providerid: '9ec59457-c81c-437b-b936-5fc84a60de7c',
      apikey: '1135e7d8-087b-4451-828a-b3fcf3161669'
    },
  ]
])


describe('@ElephantSQLInstanceProvider', () => {
  let sandbox: sinon.SinonSandbox
  let defaultElephantParam = null

  describe('#constructor', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should create new instance of ElephantSQLInstanceProvider', () => {
      const apikey = 'this-is-api-key'
      const apiInterceptorsRequestUseSpy = sandbox.spy(api.interceptors.request, 'use')
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(apikey)

      expect(elephantInstanceProvider).to.be.instanceOf(ElephantSQLInstanceProvider)
      expect(apiInterceptorsRequestUseSpy.calledOnce).to.be.true()
    })
  })

  describe('#listInstance', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should find and return instance by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const instanceName = 'be-a-savior-test'
      const instance = [...mockInstances.values()][0]
      sandbox.stub(elephantInstanceProvider, 'listInstance').resolves(instance)

      const expectedInstance = await elephantInstanceProvider.listInstance(instanceName)

      expect(expectedInstance).to.be.equal(instance)
    })

    it('should return null if not found instance by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const findInstanceIdStub = sandbox.stub(elephantInstanceProvider, 'findInstanceId').resolves(null)

      const expectedInstance = await elephantInstanceProvider.listInstance('return-null-instance')

      expect(findInstanceIdStub.calledOnce).to.be.true()
      expect(expectedInstance).to.be.null()
    })
  })

  describe('#verifyInstanceExists', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should return true if instance already exists in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const listInstanceStub = sandbox.stub(elephantInstanceProvider, 'listInstance').resolves([...mockInstances.values()][0])

      const instanceName = 'be-a-savior-test'
      const alreadyExists = await elephantInstanceProvider.verifyInstanceExists(instanceName)

      expect(listInstanceStub.calledOnce).to.be.true()
      expect(alreadyExists).to.be.true()
    })

    it('should return false if not found instance in memory or remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const listInstanceStub = sandbox.stub(elephantInstanceProvider, 'listInstance').resolves(undefined)

      const alreadyExists = await elephantInstanceProvider.verifyInstanceExists('be-a-savior-test')

      expect(listInstanceStub.calledOnce).to.be.true()
      expect(alreadyExists).to.be.false()
    })
  })

  describe('#findInstanceId', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should find instance id by name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const mockInstance = [...mockInstances.values()][0]
      const listInstancesStub = sandbox.stub(elephantInstanceProvider, 'listInstances').resolves([mockInstance])
      const instanceId = await elephantInstanceProvider.findInstanceId(mockInstance.name)

      expect(listInstancesStub.calledOnce).to.be.true()
      expect(instanceId).to.be.equal(mockInstance.id)

    })

    it('should return null if not found instance id', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const mockInstance = [...mockInstances.values()][0]
      sandbox.stub(elephantInstanceProvider, 'listInstances').resolves([])
      const instanceIdNotFound = await elephantInstanceProvider.findInstanceId(mockInstance.name)

      expect(instanceIdNotFound).to.be.null()
    })
  })

  describe('#listInstances', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('should list all instances without details', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const mockApiGetResponse = [...mockInstances.values()].map(({ id, name, plan, region, providerid }) => ({
        id, name, plan, region, tags: [], providerid
      }))

      sandbox.stub(api, 'get').resolves({
        data: mockApiGetResponse
      })

      const expectedInstances = await elephantInstanceProvider.listInstances()

      expect(expectedInstances).to.deep.equalInAnyOrder(mockApiGetResponse.map(({ id, name, plan, region, providerid }) => ({
        id,
        name,
        plan,
        region,
        providerid
      })
      ))
    })

    it('should list all instance with details passing param verbose = true', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      const mockApiGetResponse = [...mockInstances.values()].map(({ id, name, plan, region, providerid }) => ({
        id, name, plan, region, tags: [], providerid
      }))

      const apiGetStub = sandbox.stub(api, 'get')

      apiGetStub.onCall(0).resolves({
        data: mockApiGetResponse
      })
      apiGetStub.onCall(1).resolves({ data: [...mockInstances.values()][0] })
      apiGetStub.onCall(2).resolves({ data: [...mockInstances.values()][1] })
      apiGetStub.onCall(3).resolves({ data: [...mockInstances.values()][2] })

      const expectedInstances = await elephantInstanceProvider.listInstances(true)

      expect(expectedInstances).to.deep.equalInAnyOrder([...mockInstances.values()])
    })
  })


  describe('#createInstance', () => {
    beforeEach(() => sandbox = sinon.createSandbox())
    afterEach(() => sandbox.restore())

    it('create new instance in elephant service', async () => {
      const mockInstance = {
        name: 'this-is-a-new-instance50',
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1',
      }
      const mockApiPostData = {
        id: 239644,
        message: 'Instance created',
        apikey: 'd6ef6f30-5107-4edb-8da7-6babc2c52742',
        url: 'postgres://zsqkwtxb:UiT8NZVLusnZ3yuYkL8jrURNg5OGTvIV@fanny.db.elephantsql.com/zsqkwtxb'
      }
      const mockApiGetData = {
        id: 239154,
        name: "this-is-a-new-instance50",
        plan: "turtle",
        region: "amazon-web-services::us-east-1",
        tags: [],
        providerid: "9ec59457-c81c-437b-b936-5fc84a60de7c",
        url: "postgres://gxzxslmv:B3FamoI_FTyur7w9wrbMiP04BK-zwMRW@fanny.db.elephantsql.com/gxzxslmv",
        apikey: "1135e7d8-087b-4451-828a-b3fcf3161669",
        ready: true
      }

      const apiPostStub = sandbox.stub(api, 'post').resolves({
        data: mockApiPostData
      })
      const apiGetStub = sandbox.stub(api, 'get').resolves({
        data: mockApiGetData
      })

      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)
      sandbox.stub(elephantInstanceProvider, 'verifyInstanceExists').resolves(undefined)

      const newInstanceCreated = await elephantInstanceProvider.createInstance(mockInstance)

      expect(apiPostStub.calledOnce).to.be.true()
      expect(apiGetStub.calledOnce).to.be.true()
      expect(newInstanceCreated).to.deep.equal({
        id: 239154,
        name: "this-is-a-new-instance50",
        plan: "turtle",
        region: "amazon-web-services::us-east-1",
        providerid: "9ec59457-c81c-437b-b936-5fc84a60de7c",
        url: "postgres://gxzxslmv:B3FamoI_FTyur7w9wrbMiP04BK-zwMRW@fanny.db.elephantsql.com/gxzxslmv",
        apikey: "1135e7d8-087b-4451-828a-b3fcf3161669",
      })
    })

    it('should thrown an error if already exists an instance with same name in remote', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)
      const instance = {
        name: 'be-a-savior-test',
        plan: 'turtle',
        region: 'amazon-web-services::us-east-1',
      }

      sandbox.stub(elephantInstanceProvider, 'verifyInstanceExists').resolves(true)

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
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      //sandbox.stub(elephantInstanceProvider, 'findInstanceId').resolves(123456)
      const apiDeleteStub = sandbox.stub(api, 'delete')

      const deleted = await elephantInstanceProvider.deleteInstance(123456)

      expect(deleted).to.be.true()
      expect(apiDeleteStub.calledOnce).to.be.true()
    })

    it('should return false if instance already deleted', async () => {
      const elephantInstanceProvider = new ElephantSQLInstanceProvider(defaultElephantParam)

      //sandbox.stub(elephantInstanceProvider, 'findInstanceId').resolves(null)
      const apiDeleteStub = sandbox.stub(api, 'delete').rejects('Request failed with status code 404')

      const deleted = await elephantInstanceProvider.deleteInstance(123456)

      expect(deleted).to.be.false()
      expect(apiDeleteStub.calledOnce).to.be.true()
    })
  })
})
