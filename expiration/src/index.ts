import { natsWrapper } from './NatsWrapper'

async function start() {
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
  } catch (e) {
    console.error(e)
  }
}

start()
