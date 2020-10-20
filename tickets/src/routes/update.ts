import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@countryguide/common'
import { body } from 'express-validator'
import { Ticket } from '../models/Ticket'

const router = express.Router()

router.put(
  TicketsAPI.withId({id: ':id'}),
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

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    await ticket.save()

    res.send(ticket)
  }
)

export { router as updateTicketRouter}