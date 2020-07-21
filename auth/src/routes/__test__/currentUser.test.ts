import request from 'supertest'
import { app } from '../../app'
import { UserAPI } from '../../API'
import { signUp } from '../../test/authHelper'

it('Responds with details about current user', async () => {
  const cookie = await signUp()

  const response = await request(app).get(UserAPI.currentUser).set('Cookie', cookie).send().expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('Responds with null if not authenticated', async () => {
  const response = await request(app).get(UserAPI.currentUser).send().expect(200)

  expect(response.body.currentUser).toEqual(null)
})
