import mongoose from 'mongoose'
import { app } from './app'

async function startDb() {
  if (!process.env.JWT_KEY) {
    throw new Error('No JWT key defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('No MONGO_URI key defined')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
