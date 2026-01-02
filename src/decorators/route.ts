import { storage } from '../metadata/metadata-storage'
import { HTTPMethod } from '../metadata/metadata'

function RouteDecoratorFactory(path: string, httpMethod: HTTPMethod) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    storage.setRoute(target.constructor, propertyKey, path, httpMethod)
  }
}

export function Get(path: string) {
  return RouteDecoratorFactory(path, 'GET')
}

export function Post(path: string) {
  return RouteDecoratorFactory(path, 'POST')
}

export function Put(path: string) {
  return RouteDecoratorFactory(path, 'PUT')
}

export function Delete(path: string) {
  return RouteDecoratorFactory(path, 'DELETE')
}
