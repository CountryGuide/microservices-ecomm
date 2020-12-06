import { BasePublisher, Subjects, OrderCreatedEvent } from '@countryguide/common'

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
