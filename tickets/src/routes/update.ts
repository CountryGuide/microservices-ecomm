import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@countryguide/common'
import { body } from 'express-validator'
import { Ticket } from '../models/Ticket'
import { natsWrapper } from '../NatsWrapper'
import { TicketUpdatedPublisher } from '../events/publishers/TicketUpdatedPublisher'

const router = express.Router()

router.put(
  TicketsAPI.withId({ id: ':id' }),
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('You must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('You must provide a price greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Ticket is reserved and cannot be changed')
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })

    await ticket.save()

    await new TicketUpdatedPublisher(natsWrapper.stan).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.send(ticket)
  }
)

export { router as updateTicketRouter }
