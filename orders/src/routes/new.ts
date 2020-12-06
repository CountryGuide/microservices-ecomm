import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@countryguide/common'
import { body } from 'express-validator'
import { OrdersAPI } from '../API'
import { Ticket } from '../models/Ticket'
import { Order } from '../models/Order'
import { OrderCreatedPublisher } from '../events/publishers/OrderCreatedPublisher'
import { natsWrapper } from '../NatsWrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  OrdersAPI.index(),
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('Ticket id must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('This ticket is reserved')
    }

    const expiresAt = new Date()

    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
      ticket,
      expiresAt,
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
    })

    await order.save()

    await new OrderCreatedPublisher(natsWrapper.stan).publish({
      expiresAt: order.expiresAt.toISOString(),
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      ticket: { id: ticket.id, price: ticket.price },
    })

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
