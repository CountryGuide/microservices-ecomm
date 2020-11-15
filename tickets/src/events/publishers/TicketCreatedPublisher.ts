import { BasePublisher, Subjects, TicketCreatedEvent } from '@countryguide/common'

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}