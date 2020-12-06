import { BaseListener, Subjects, TicketUpdatedEvent } from '@countryguide/common'
import { Message } from 'node-nats-streaming'
import { QueueGroups } from './QueueGroups'
import { Ticket } from '../../models/Ticket'

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  async onMessage({ id, title, price, version }: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent({ id, version })

    if (!ticket) {
      throw new Error('TicketNotFound')
    }

    ticket.set({ title, price })

    await ticket.save()

    msg.ack()
  }

  queueGroupName = QueueGroups.OrdersService
  readonly subject = Subjects.TicketUpdated
}
