import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { requireAuth, validateRequest } from '@countryguide/common'
import { body } from 'express-validator'
import { Ticket } from '../models/Ticket'
import { TicketCreatedPublisher } from '../events/publishers/TicketCreatedPublisher'
import { natsWrapper } from '../NatsWrapper'

const router = express.Router()

router.post(
  TicketsAPI.index(),
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('You must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('You must provide a price greater than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })

    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.stan).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
