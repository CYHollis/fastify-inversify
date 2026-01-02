import { storage } from '../metadata/metadata-storage'

function ParameterDecoratorsFactory(location: string[]) {
  return function (
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    storage.setParameter(
      target.constructor,
      propertyKey,
      parameterIndex,
      location
    )
  }
}

export function Param(paramName?: string) {
  return ParameterDecoratorsFactory(
    paramName ? ['request', 'params', paramName] : ['request', 'params']
  )
}

export function Header(headerName?: string) {
  return ParameterDecoratorsFactory(
    headerName ? ['request', 'headers', headerName] : ['request', 'headers']
  )
}

export function Body() {
  return ParameterDecoratorsFactory(['request', 'body'])
}

export function Request(paramName?: string) {
  return ParameterDecoratorsFactory(
    paramName ? ['request', paramName] : ['request']
  )
}

export function Valid(dtoCtor: Function) {
  return function (
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    storage.setDTO(target.constructor, propertyKey, parameterIndex, dtoCtor)
  }
}
