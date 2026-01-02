import { Metadata } from '@auroravpn/class-metadata'

// 基础元数据, 包含所有控制器
export class BaseMetadata extends Metadata {
  getController(constructorName: string) {
    return this.get(constructorName) as ControllerMetadata | undefined
  }
  setController(constructor: Function, prefix: string) {
    const ctrl = this.getController(constructor.name)
    // 如果控制器存在, 修改控制器元数据
    if (ctrl) {
      ctrl.prefix = prefix
      ctrl.target = constructor
      return
    }
    // 如果控制器不存在, 添加控制器
    this.define(constructor.name, new ControllerMetadata(prefix, constructor))
  }
}

// 控制器元数据, 包含所有路由
export class ControllerMetadata extends Metadata {
  constructor(
    public prefix: string,
    public target: Function
  ) {
    super()
  }

  getRoute(propertyName: string) {
    return this.get(propertyName) as RouteMetadata | undefined
  }

  setRoute(propertyName: string, path: string, method: HTTPMethod) {
    const route = this.getRoute(propertyName)
    if (route) {
      route.path = path
      route.method = method
      return
    }
    this.define(propertyName, new RouteMetadata(path, method))
  }
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// 路由元数据, 包含路由参数
export class RouteMetadata extends Metadata {
  constructor(
    public path: string,
    public method: HTTPMethod,
    public parameters: ParameterMetadata[] = []
  ) {
    super()
  }

  getParameter(paramIndex: number) {
    return this.parameters[paramIndex]
  }

  setParameter(paramIndex: number, locations: string[]) {
    this.parameters[paramIndex] = new ParameterMetadata(locations)
    const parameter = this.getParameter(paramIndex)
    if (parameter) {
      parameter.locations = locations
      return
    }
    this.parameters[paramIndex] = new ParameterMetadata(locations)
  }
}

export class ParameterMetadata extends Metadata {
  constructor(
    public locations: string[],
    public dto?: Function
  ) {
    super()
  }

  setDTO(dto: Function) {
    this.dto = dto
  }
}
