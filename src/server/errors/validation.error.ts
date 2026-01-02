export class ValidationError extends Error {
  code = 'VALIDATION_FAILED'
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
