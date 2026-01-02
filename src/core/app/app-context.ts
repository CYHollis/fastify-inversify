import { FastifyInstance } from 'fastify'
import { Container } from 'inversify'
import { AppCtxNotInitializedError } from './errors/app-ctx-not-ini.error'

class AppContext {
  private fastify: FastifyInstance | null = null
  private container: Container | null = null

  initContext(ctx: { fastify: FastifyInstance; container: Container }) {
    this.fastify = ctx.fastify
    this.container = ctx.container
  }

  getFastify() {
    if (!this.fastify) {
      throw new AppCtxNotInitializedError('No context found for this app')
    }
    return this.fastify
  }

  getContainer() {
    if (!this.container) {
      throw new AppCtxNotInitializedError('No context found for this app')
    }
    return this.container
  }
}

export const context = new AppContext()
