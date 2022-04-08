import { Request, Response } from 'express'
import { expect } from 'chai'
import sinon, { SinonStubbedInstance } from 'sinon'
import BaseController from '@controllers/BaseController'
import { Logger } from '@common/logger'
import { Router } from '@controllers/BaseController'

describe('@BaseController', () => {
  let sandbox: sinon.SinonSandbox
  let loggerStub: SinonStubbedInstance<Logger>
  let routesStub: SinonStubbedInstance<Router>
  const handle = async function (_: Request, response: Response) {
    return response
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    loggerStub = <SinonStubbedInstance<Logger>><unknown>{
      info: sandbox.stub()
    }
    routesStub = <SinonStubbedInstance<Router>><unknown>{
      post: sandbox.stub()
    }
  })
  afterEach(() => sandbox.restore())
  describe('#endpointAccessLog', () => {
    it('#should show log using method, path userId, and date from access at endpoint', () => {
      const dateTimestampMocked = 1649448102038

      const methodMocked = 'methodMocked'
      const pathMocked = '/pathMocked'
      const userIdMocked = 'userIdMocked'
      const dateNowMocked = sandbox.stub(Date, 'now')
        .returns(dateTimestampMocked )

      class A extends BaseController {
        handle = handle
      }

      const baseController = new A(
        loggerStub,
        routesStub
      )

      baseController.endpointAccessLog(
        methodMocked,
        pathMocked,
        userIdMocked
      )
      const log = '> METHODMOCKED "/pathmocked" accessed by user userIdMocked in 08/04/2022 8:01:42,038 PM'

      expect(loggerStub.info.calledOnceWith(log)).to.be.true()
      expect(dateNowMocked.calledOnce).to.be.true()
    })
  })

  describe('#setMiddlewares', () => {
    it('Should define middlewares to endpoint', () => {
      class A extends BaseController {
        handle = handle
      }

      const genericEndpoint = new A(
        loggerStub,
        routesStub
      )

      genericEndpoint.setMiddlewares([
        () => {},
        () => {} 
      ])
      expect(genericEndpoint['middlewares'].length === 2).to.be.true()
    })
  })

  describe('#setMiddlewares', () => {
    it('Should define middlewares to endpoint', () => {
      class A extends BaseController {
        handle = handle
      }

      const genericEndpoint = new A(
        loggerStub,
        routesStub
      )

      genericEndpoint.setMiddlewares([
        () => {},
        () => {} 
      ])
      expect(genericEndpoint['middlewares'].length === 2).to.be.true()
    })
  })

  describe('#subscribe', () => {
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => sandbox.restore())

    it('should subscribe endpoint (method, path, handle)', () => {
 
      class A extends BaseController {
        handle = handle
      }

      const baseController = new A(
        loggerStub,
        routesStub
      )

      const handler = (_: Request, response: Response) => response
      baseController.subscribe({
        method: 'post',
        path: '/test',
        handler
      })
      expect(loggerStub.info.calledOnce).to.be.true()
      expect(routesStub.post.calledOnce).to.be.true()
    })
  })
})
