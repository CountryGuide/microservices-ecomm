import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/ExpirationCompletePublisher'
import { natsWrapper } from '../NatsWrapper'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async ({ data: { orderId } }) => {
  await new ExpirationCompletePublisher(natsWrapper.stan).publish({ orderId })
})

export { expirationQueue }
