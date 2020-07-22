import { UserAPI } from '../API'
import { app } from '../app'
import request from 'supertest'

export async function signUp() {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app).post(UserAPI.signUp).send({ email, password }).expect(201)

  return response.get('Set-Cookie')
}
