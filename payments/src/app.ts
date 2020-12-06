import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUser, errorHandler, NotFoundError } from '@countryguide/common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', 1)

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)
app.use(currentUser)

app.use(createChargeRouter)

app.get('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }