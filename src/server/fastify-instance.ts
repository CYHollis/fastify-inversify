import fastify from 'fastify'
import cookie from '@fastify/cookie'

export function createFastify() {
  const instance = fastify().register(cookie)
  return instance
}
