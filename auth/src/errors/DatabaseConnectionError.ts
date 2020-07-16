import { CustomError } from './CustomError'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Failed connect to database'
  constructor() {
    super('Failed connect to database')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  serializeErrors() {
    return [{ message: this.reason }]
  }
}
