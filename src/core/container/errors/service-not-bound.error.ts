export class ServiceNotBoundError extends Error {
  code = 'SERVICE_NOT_BOUND'
  constructor(message: string) {
    super(message)
    this.name = 'ServiceNotBoundError'
  }
}
