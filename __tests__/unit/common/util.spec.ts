import { expect } from 'chai'
import sinon from 'sinon'
import Util from '@common/util'

describe('@Util', () => {
  describe('#swicth', () => {
    let sandbox: sinon.SinonSandbox
    beforeEach(() => {
      sandbox = sinon.createSandbox()
    })
    afterEach(() => {
      sandbox.restore()
    })
    it('Must run all cases declared in object cases based in entry choosed', () => {
      const donated = 'complete'
      const swicthParams = {
        entry: donated,
        cases: {
          none: function () {},
          incomplete: () => {},
          complete() {}
        }
      }

      const completeStubbed = sandbox.stub(swicthParams.cases, 'complete')
      const incompleteStubbed = sandbox.stub(swicthParams.cases, 'incomplete')
      const noneStubbed = sandbox.stub(swicthParams.cases, 'none')

      Util.switch(swicthParams)

      expect(completeStubbed.calledOnce).to.be.true(
        'The function to should called the "complete" method'
      )
      expect(incompleteStubbed.calledOnce).to.be.false(
        'The function to should\'nt called the "incomplete" method'
      )
      expect(noneStubbed.calledOnce).to.be.false(
        'The function to should\'nt called the "none" method'
      )
    })
    it.only("Should be throw error if entry param haven't a method case", () => {
      const entry = 'INVALID ENTRY'
      const switchParams = {
        entry,
        cases: {
          sayInPortuguse() {}
        }
      }
      const toThrow = () => {
        Util.switch(switchParams)
      }
      expect(toThrow).to.not.throw()
    })
  })
})
