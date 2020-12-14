import { BaseListener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from '@countryguide/common'
import { QueueGroups } from './QueueGroups'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/Order'

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGroupName = QueueGroups.OrdersService

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new NotFoundError()
    }

    order.set({
      status: OrderStatus.Complete,
    })

    await order.save()

    msg.ack()
  }
}
