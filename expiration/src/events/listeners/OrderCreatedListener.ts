import { BaseListener, OrderCreatedEvent, Subjects } from '@countryguide/common'
import { Message } from 'node-nats-streaming'
import { QueueGroups } from './QueueGroups'
import { expirationQueue } from '../../queues/expirationQueue'

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    )

    msg.ack()
  }

  queueGroupName = QueueGroups.ExpirationService
  readonly subject = Subjects.OrderCreated
}
