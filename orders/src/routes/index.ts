import express, { Request, Response } from 'express'
import { OrdersAPI } from '../API'
import { requireAuth } from '@countryguide/common'
import { Order } from '../models/Order'

const router = express.Router()

router.get(OrdersAPI.index(), requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket')

  res.send(orders)
})

export { router as indexOrderRouter }
