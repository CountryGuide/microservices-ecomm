import mongoose from 'mongoose'
import { app } from './app'

async function startDb() {
  if (!process.env.JWT_KEY) {
    throw new Error('No JWT key defined')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  } catch (e) {
    console.error(e)
  }

  app.listen(3000)
}

startDb()
