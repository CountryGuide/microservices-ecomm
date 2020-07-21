import request from 'supertest'
import { app } from '../../app'
import { UserAPI } from '../../API'

it('returns 201  on successful signup', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('returns 400 with invalid email ', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'tesest.com',
      password: 'password',
    })
    .expect(400)
})

it('returns 400 with invalid password', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'c',
    })
    .expect(400)
})

it('disallow duplicate emails', async () => {
  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('sets a cookie after successful request', async () => {
  const response = await request(app)
    .post(UserAPI.signUp)
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
