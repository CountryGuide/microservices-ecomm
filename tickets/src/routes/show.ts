import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { Ticket } from '../models/Ticket'
import { NotFoundError } from '@countryguide/common'


const router = express.Router()

router.get(
  TicketsAPI.withId({id: ':id'}),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    res.send(ticket)
  }
)

export { router as showTicketRouter }