import request from 'supertest'
import { app } from '../../app'
import { TicketsAPI } from '../../API'
import { signUp } from '../../test/authHelper'

it('has a route /api/tickets for post requests', async () => {
  const response = await request(app).post(TicketsAPI.create).send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if user is signed in', async () => {
  await request(app).post(TicketsAPI.create).send({}).expect(401)
})

it('return a status other than 401 if user is signed in', async () => {
  const response = await request(app).post(TicketsAPI.create).set('Cookie', signUp()).send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post(TicketsAPI.create)
    .set('Cookie', signUp())
    .send({
      title: '',
      price: 10,
    })
    .expect(400)

  await request(app)
    .post(TicketsAPI.create)
    .set('Cookie', signUp())
    .send({
      price: 10,
    })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post(TicketsAPI.create)
    .set('Cookie', signUp())
    .send({
      title: 'ksgkfll',
      price: -10,
    })
    .expect(400)

  await request(app)
    .post(TicketsAPI.create)
    .set('Cookie', signUp())
    .send({
      title: 'ksgkfll',
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  await request(app)
    .post(TicketsAPI.create)
    .set('Cookie', signUp())
    .send({
      title: 'ksgkfll',
      price: 10.0,
    })
    .expect(201)
})
