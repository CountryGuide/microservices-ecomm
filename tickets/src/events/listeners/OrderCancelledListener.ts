import { BaseListener, NotFoundError, OrderCancelledEvent, Subjects } from '@countryguide/common'
import { Message } from 'node-nats-streaming'
import { QueueGroups } from './QueueGroups'
import { Ticket } from '../../models/Ticket'
import { TicketUpdatedPublisher } from '../publishers/TicketUpdatedPublisher'

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    ticket.set({ orderId: undefined })

    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    })

    msg.ack()
  }

  queueGroupName = QueueGroups.TicketsService
  readonly subject = Subjects.OrderCancelled
}
