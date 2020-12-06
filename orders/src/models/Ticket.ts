import mongoose from 'mongoose'
import { Order } from './Order'
import { OrderStatus } from '@countryguide/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  title: string
  price: number
  id: string
}

export interface TicketDocument extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument
  findByEvent(event: { id: string; version: number }): Promise<TicketDocument | null>
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id
        delete ret.__v
        delete ret._id
      },
    },
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema)

export { Ticket }
