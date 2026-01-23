export class AppCtxNotInitializedError extends Error {
  code = 'APPCTX_NOT_INITIALIZED'
  constructor(message: string) {
    super(message)
    this.name = 'AppCtxNotInitializedError'
  }
}
