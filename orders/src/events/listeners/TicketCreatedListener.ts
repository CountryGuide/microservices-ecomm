import { BaseListener, Subjects, TicketCreatedEvent } from '@countryguide/common'
import { Message } from 'node-nats-streaming'
import { QueueGroups } from './QueueGroups'
import { Ticket } from '../../models/Ticket'

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  async onMessage({ id, title, price }: TicketCreatedEvent['data'], msg: Message) {
    const ticket = Ticket.build({ title, price, id })

    await ticket.save()

    msg.ack()
  }

  queueGroupName = QueueGroups.OrdersService
  readonly subject = Subjects.TicketCreated
}
