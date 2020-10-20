import request from 'supertest'
import mongoose from 'mongoose'
import {app} from '../../app'
import { TicketsAPI } from '../../API'
import { signUp } from '../../test/authHelper'


const createTicket = () => ['ksgkfll', 10.0]

it('returns 404 if ticket not found', async () => {
  const [title, price] = createTicket()

  await request(app)
    .put(TicketsAPI.withId({id: new mongoose.Types.ObjectId().toHexString()}))
    .set('Cookie', signUp())
    .send({
      title,
      price,
    })
    .expect(404)
})

it('returns 401 if you are not logged in', async () => {
  const [title, price] = createTicket()

  await request(app)
    .put(TicketsAPI.withId({id: new mongoose.Types.ObjectId().toHexString()}))
    .send({
      title,
      price,
    })
    .expect(401)
})

it('returns 401 if you are not owner of a ticket', async () => {
  const [title, price] = createTicket()

  const ticket = await request(app)
    .post(TicketsAPI.index())
    .set('Cookie', signUp())
    .send({
      title,
      price,
    })
    .expect(201)

  await request(app)
    .put(TicketsAPI.withId({id: ticket.body.id}))
    .set('Cookie', signUp())
    .send({
      title,
      price,
    })
    .expect(401)
})

it('returns 400 if invalid title or price provided', async () => {
  const [title, price] = createTicket()
  const cookie = signUp()

  const ticket = await request(app)
    .post(TicketsAPI.index())
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(201)

  await request(app)
    .put(TicketsAPI.withId({id: ticket.body.id}))
    .set('Cookie', cookie)
    .send({
      title: 2222,
      price: 'fa',
    })
    .expect(400)
})

it('updates a ticket', async () => {
  const [title, price] = createTicket()
  const cookie = signUp()

  const ticket = await request(app)
    .post(TicketsAPI.index())
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(201)

  const response = await request(app)
    .put(TicketsAPI.withId({id: ticket.body.id}))
    .set('Cookie', cookie)
    .send({
      title,
      price: 150.0,
    })
    .expect(200)

  expect(response.body.title).toEqual(title)
  expect(response.body.price).toEqual(150.0)

  const fetchedTicket = await request(app)
    .get(TicketsAPI.withId({id: ticket.body.id}))
    .send()
    .expect(200)

  expect(fetchedTicket.body.title).toEqual(title)
  expect(fetchedTicket.body.price).toEqual(150.0)
})