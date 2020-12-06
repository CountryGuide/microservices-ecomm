import { BaseListener, ExpirationCompleteEvent, NotFoundError, OrderStatus, Subjects } from '@countryguide/common'
import { QueueGroups } from './QueueGroups'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/Order'
import { OrderCancelledPublisher } from '../publishers/OrderCancelledPublisher'

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.status === OrderStatus.Complete) {
      msg.ack()
    }

    order.set({
      status: OrderStatus.Cancelled,
    })

    await order.save()

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    msg.ack()
  }

  queueGroupName = QueueGroups.OrdersService
  readonly subject = Subjects.ExpirationComplete
}
