import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export function signUp() {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = JSON.stringify({ jwt: token })
  const base64 = Buffer.from(session).toString('base64')

  return [`express:sess=${base64}`]
}
