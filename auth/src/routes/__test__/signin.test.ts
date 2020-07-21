import request from 'supertest'
import { app } from '../../app'
import { UserAPI } from '../../API'

it('fails  if email does not exist', async () => {
  await request(app)
    .post(UserAPI.signIn)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('fails with invalid password', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post(UserAPI.signIn)
    .send({
      email: 'test@test.com',
      password: 'paword',
    })
    .expect(400)
})

it('responds with a cookie with valid creds', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post(UserAPI.signIn)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
