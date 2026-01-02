import { context } from '../app/app-context'
import { ServiceNotBoundError } from './errors/service-not-bound.error'

export function resolve(constructor: Function) {
  try {
    return context.getContainer().get(constructor) as any
  } catch (error: any) {
    throw new ServiceNotBoundError(error.message.split('\n')[0])
  }
}
