import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { Ticket } from '../models/Ticket'

const router = express.Router()

router.get(
  TicketsAPI.index(),
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})

    res.send(tickets)
  }
)

export { router as indexTicketRouter }