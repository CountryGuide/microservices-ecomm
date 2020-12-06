import { BasePublisher, ExpirationCompleteEvent, Subjects } from '@countryguide/common'

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
  subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete
}
