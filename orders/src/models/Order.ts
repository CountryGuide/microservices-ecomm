import mongoose from 'mongoose'
import { OrderStatus } from '@countryguide/common'
import { TicketDocument } from './Ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  status: OrderStatus
  expiresAt: Date
  userId: string
  ticket: TicketDocument
}

interface OrderDocument extends mongoose.Document {
  status: OrderStatus
  expiresAt: Date
  userId: string
  ticket: TicketDocument
  version: number
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema)

export { Order }
