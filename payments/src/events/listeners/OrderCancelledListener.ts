import { BaseListener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from '@countryguide/common'
import { QueueGroups } from './QueueGroups'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/Order'

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    if (!order) {
      throw new NotFoundError()
    }

    order.set({
      status: OrderStatus.Cancelled,
    })

    await order.save()

    msg.ack()
  }

  queueGroupName = QueueGroups.PaymentsService
  readonly subject = Subjects.OrderCancelled
}
