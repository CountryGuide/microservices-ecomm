import { BaseListener, OrderCreatedEvent, Subjects } from '@countryguide/common'
import { QueueGroups } from './QueueGroups'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/Order'

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    })

    await order.save()

    msg.ack()
  }

  queueGroupName = QueueGroups.PaymentsService
  readonly subject = Subjects.OrderCreated
}
