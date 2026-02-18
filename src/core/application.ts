import { Container } from 'inversify'
import { context } from './app-context'
import { createFastify } from '../server/fastify-instance'
import { loadRoutes } from '../server/routes-loader'
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

  async ready() {
    return context.getFastify().ready()
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
    callback: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void> | void
  ) {
    context.getFastify().addHook('onRequest', async (request, reply) => {
      await callback(request, reply)
    })
  }

  setResponseInterceptor(callback: (payload: unknown) => unknown) {
    context
      .getFastify()
      .addHook('onSend', async (request, reply, payload: string) => {
        reply.header('Content-Type', 'application/json; charset=utf-8')
        if (reply.statusCode === 200) {
          let param
          try {
            param = JSON.parse(payload)
          } catch {
            param = payload
          }
          try {
            return JSON.stringify(await callback(param))
          } catch {
            return await callback(param)
          }
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
