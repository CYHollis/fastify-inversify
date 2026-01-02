import { Container } from 'inversify'
import { context } from './app-context'
import { createFastify } from '../../server/fastify-instance'
import { loadRoutes } from '../../server/routes-loader'
import { FastifyReply, FastifyRequest } from 'fastify'

export class InversifyFastify {
  constructor(container: Container) {
    context.initContext({
      fastify: createFastify(),
      container
    })
    loadRoutes()
  }

  build() {
    return context.getFastify().server
  }

  async listen(opts?: { port?: number; host?: string }, callback?: () => void) {
    const fastify = context.getFastify()
    if (opts) {
      await fastify.listen({ port: opts.port, host: opts.host })
      callback?.()
      return
    }
    await fastify.listen()
  }

  async close() {
    context.getFastify().close()
  }

  setRequestInterceptor(
    callback: (request: FastifyRequest, reply: FastifyReply) => unknown
  ) {
    context.getFastify().addHook('onRequest', (request, reply) => {
      callback(request, reply)
    })
  }

  setResponseInterceptor(callback: (payload: unknown) => unknown) {
    context.getFastify().addHook('onSend', async (request, reply, payload) => {
      reply.header('Content-Type', 'application/json; charset=utf-8')
      if (reply.statusCode === 200) {
        return JSON.stringify(callback(payload))
      }
      return payload
    })
  }

  setExceptionInterceptor(
    callback: (error: unknown) => { payload: unknown; status: number }
  ) {
    context.getFastify().setErrorHandler((error, request, reply) => {
      const { payload, status } = callback(error)
      reply.status(status).send(payload)
    })
  }
}
