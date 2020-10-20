import request from 'supertest'
import {app} from '../../app'
import { TicketsAPI } from '../../API'
import { signUp } from '../../test/authHelper'


it('returns all tickets', async () => {
  for (let i = 0; i < 4; i++) {
    const [title, price] = ['ksgkfll', 10.0]

    await request(app)
      .post(TicketsAPI.index())
      .set('Cookie', signUp())
      .send({
        title,
        price,
      })
  }

  const response = await request(app)
    .get(TicketsAPI.index())
    .send()
    .expect(200)

  expect(response.body.length).toEqual(4)
})