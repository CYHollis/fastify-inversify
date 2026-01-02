import { BaseMetadata, HTTPMethod } from './metadata'

class MetadataStorage {
  metadata: BaseMetadata = new BaseMetadata()
  constructor() {}

  setController(constructor: Function, prefix: string) {
    this.metadata.setController(constructor, prefix)
  }

  setRoute(
    constructor: Function,
    propertyName: string,
    path: string,
    method: HTTPMethod
  ) {
    const ctrl = this.metadata.getController(constructor.name)
    if (ctrl) {
      ctrl.setRoute(propertyName, path, method)
      return
    }
    this.setController(constructor, '')
    this.setRoute(constructor, propertyName, path, method)
  }

  setParameter(
    constructor: Function,
    propertyName: string,
    paramIndex: number,
    locations: string[]
  ) {
    const route = this.metadata
      .getController(constructor.name)
      ?.getRoute(propertyName)
    if (route) {
      route.setParameter(paramIndex, locations)
      return
    }
    // 如果没有route, 先添加route, 再递归添加parameter
    this.setRoute(constructor, propertyName, '', 'GET')
    this.setParameter(constructor, propertyName, paramIndex, locations)
  }

  setDTO(
    constructor: Function,
    propertyName: string,
    paramIndex: number,
    dto: Function
  ) {
    // 只有存在这个参数的时候才添加dto
    this.metadata
      .getController(constructor.name)
      ?.getRoute(propertyName)
      ?.getParameter(paramIndex)
      ?.setDTO(dto)
  }
}

export const storage = new MetadataStorage()
