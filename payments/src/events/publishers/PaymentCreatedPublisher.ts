import { BasePublisher, PaymentCreatedEvent, Subjects } from '@countryguide/common'

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated
}
