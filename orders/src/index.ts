import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './NatsWrapper'
import { TicketCreatedListener } from './events/listeners/TicketCreatedListener'
import { TicketUpdatedListener } from './events/listeners/TicketUpdatedListener'

async function startDb() {
  if (!process.env.JWT_KEY) {
    throw new Error('No JWT key defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('No MONGO_URI key defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('No NATS_CLIENT_ID key defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('No NATS_CLUSTER_ID key defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('No NATS_URL key defined')
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    natsWrapper.stan.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.stan.close())
    process.on('SIGTERM', () => natsWrapper.stan.close())

    new TicketCreatedListener(natsWrapper.stan).listen()
    new TicketUpdatedListener(natsWrapper.stan).listen()

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
