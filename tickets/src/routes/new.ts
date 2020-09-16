import express, { Request, Response } from 'express'
import { TicketsAPI } from '../API'
import { requireAuth, validateRequest } from '@countryguide/common'
import { body } from 'express-validator'

const router = express.Router()

router.post(
  TicketsAPI.create,
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('You must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('You must provide a price greater than zero'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200)
  }
)

export { router as createTicketRouter }
