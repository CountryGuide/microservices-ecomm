import request from 'supertest'
import { app } from '../../app'
import { UserAPI } from '../../API'

it('successfully sign out', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app).post(UserAPI.signOut).send({}).expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
