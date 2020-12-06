import express, { Request, Response } from 'express'
import { OrdersAPI } from '../API'
import { NotAuthorizedError, NotFoundError, requireAuth, OrderStatus } from '@countryguide/common'
import { Order } from '../models/Order'
import { OrderCancelledPublisher } from '../events/publishers/OrderCancelledPublisher'
import { natsWrapper } from '../NatsWrapper'

const router = express.Router()

router.delete(OrdersAPI.withId({ id: ':orderId' }), requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled

  await order.save()

  await new OrderCancelledPublisher(natsWrapper.stan).publish({
    id: order.id,
    version: order.version,
    ticket: { id: order.ticket.id },
  })

  res.status(204).send(order)
})

export { router as deleteOrderRouter }
