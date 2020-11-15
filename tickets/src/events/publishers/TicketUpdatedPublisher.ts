import { BasePublisher, Subjects, TicketUpdatedEvent } from '@countryguide/common'

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
