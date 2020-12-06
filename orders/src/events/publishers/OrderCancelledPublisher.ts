import { BasePublisher, Subjects, OrderCancelledEvent } from '@countryguide/common'

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
