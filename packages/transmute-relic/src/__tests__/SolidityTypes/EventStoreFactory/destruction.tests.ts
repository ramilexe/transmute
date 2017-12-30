import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../SolidityTypes'
import { getRelic } from '../../../__mocks__/setup'
import { EventTransformer } from '../../../Utils/EventTransformer'
import { IFSA } from '../../../Store/EventTypes'

import Relic from '../../../transmute-relic'

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let relic: Relic
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    relic = await getRelic()
    accounts = await relic.getAccounts()
  })

  describe('factory lifecycle', async () => {
    it('the factory owner can recycle', async () => {
      const fundingAmountWei = 13370000000000000000
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]))

      // factory balance is intially 0
      let initialFactoryBalance = await relic.getBalance(factory.address)
      expect(initialFactoryBalance).toBe(0)

      // the factory owner is the factory contract deployer
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe(accounts[0])

      // anyone can send the factory wei
      receipt = await factory.sendTransaction({
        from: accounts[0],
        value: fundingAmountWei
      } as any)
      let updatedFactoryBalance = await relic.getBalance(factory.address)
      expect(updatedFactoryBalance).toBe(fundingAmountWei)

      let initialOwnerBalance = await relic.getBalance(factoryOwner)

      // transfers funds to owner via selfdestruct
      receipt = await factory.recycle(W3.TC.txParamsDefaultDeploy(accounts[0]))
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe('RECYCLED_TO')
      expect(events[0].payload.value).toBe(factoryOwner)

      // ensure owner received funds
      let ownerBalanceAfterRecycle = await relic.getBalance(factoryOwner)
      expect(ownerBalanceAfterRecycle).toBeGreaterThan(initialOwnerBalance)

      // recycled factories are owned by 0x0
      factoryOwner = await factory.owner()
      expect(factoryOwner).toBe('0x0')
    })

    it('the factory owner can recycleAndSend', async () => {
      const fundingAmountWei = 13370000000000000000
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]))

      // factory balance is intially 0
      let initialFactoryBalance = await relic.getBalance(factory.address)
      expect(initialFactoryBalance).toBe(0)

      // anyone can send the factory wei
      receipt = await factory.sendTransaction({
        from: accounts[0],
        value: fundingAmountWei
      } as any)
      let updatedFactoryBalance = await relic.getBalance(factory.address)
      expect(updatedFactoryBalance).toBe(fundingAmountWei)

      let initialRecipientBalance = await relic.getBalance(accounts[1])

      // transfers funds to _recipient via selfdestruct
      receipt = await factory.recycleAndSend(accounts[1], W3.TC.txParamsDefaultDeploy(accounts[0]))
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe('RECYCLED_TO')
      expect(events[0].payload.value).toBe(accounts[1])

      // ensure recipient received funds
      let recipientBalanceAfterRecycle = await relic.getBalance(accounts[1])
      expect(recipientBalanceAfterRecycle).toBeGreaterThan(initialRecipientBalance)

      // recycled factories are owned by 0x0
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe('0x0')
    })
  })
})
