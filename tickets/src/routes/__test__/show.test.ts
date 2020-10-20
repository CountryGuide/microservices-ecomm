import request from 'supertest'
import mongoose from 'mongoose'
import {app} from '../../app'
import { TicketsAPI } from '../../API'
import { signUp } from '../../test/authHelper'


it('returns 404 if ticket not found', async () => {
  await request(app)
    .get(TicketsAPI.withId({id: new mongoose.Types.ObjectId().toHexString()}))
    .send()
    .expect(404)
})

it('returns a ticket', async () => {
  const [title, price] = ['ksgkfll', 10.0]

  const ticket = await request(app)
    .post(TicketsAPI.index())
    .set('Cookie', signUp())
    .send({
      title,
      price,
    })
    .expect(201)

  const response = await request(app)
    .get(TicketsAPI.withId({id: ticket.body.id}))
    .send()
    .expect(200)

  expect(response.body.title).toEqual(title)
  expect(response.body.price).toEqual(price)
})