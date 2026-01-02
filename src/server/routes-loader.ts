import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { context } from '../core/app/app-context'
import { resolve } from '../core/container/resolver'
import { storage } from '../metadata/metadata-storage'
import {
  ControllerMetadata,
  ParameterMetadata,
  RouteMetadata
} from '../metadata/metadata'
import { ValidationError } from './errors/validation.error'

// 参数
let params: any[] = []

// 解析参数
function parseParameters(
  parameters: ParameterMetadata[],
  request: FastifyRequest
) {
  const params: any[] = []
  parameters.forEach((parameter) => {
    const { locations } = parameter
    let res: any
    if (locations[0] === 'request') {
      res = request
      if (locations.length === 1) {
        return params.push(res)
      }
      if (
        locations[1] === 'body' ||
        locations[1] === 'params' ||
        locations[1] === 'headers'
      ) {
        res = request[locations[1]]
        if (locations.length === 2) {
          return params.push(res)
        }
        if (locations[2]) {
          res = res[locations[2]]
        }
      }
    }
    params.push(res)
  })
  return params
}

// 创建插件
function createPlugin(
  controller: ControllerMetadata,
  route: RouteMetadata,
  propertyName: string
) {
  const path = controller.prefix + route.path
  const handler = (request: FastifyRequest, reply: FastifyReply) => {
    return resolve(controller.target)[propertyName](...params)
  }
  const plugin: FastifyPluginAsync = async (fastify, opts) => {
    if (route.method === 'GET') {
      fastify.get(path, handler)
    }
    if (route.method === 'POST') {
      fastify.post(path, handler)
    }

    if (route.method === 'PUT') {
      fastify.put(path, handler)
    }

    if (route.method === 'DELETE') {
      fastify.delete(path, handler)
    }

    // 数据验证模块
    fastify.addHook('preValidation', async (request, reply) => {
      // 解析参数
      params = parseParameters(route.parameters, request)
      // 使用forof代替forEach, 防止错误处理无法体跳出循环问题
      for (const [index, param = {}] of params.entries()) {
        const dto = route.getParameter(index).dto
        if (dto) {
          const instance = plainToInstance(dto as ClassConstructor<any>, param)
          const errors = await validate(instance)
          if (errors.length > 0) {
            const messages = errors[0].constraints as {
              [key: string]: string
            }
            const msg = messages[Object.keys(messages)[0]]
            throw new ValidationError(msg)
          }
        }
      }
    })
  }
  return plugin
}

// 通过元数据加载路由模块
export function loadRoutes() {
  storage.metadata.each<ControllerMetadata>((controller) => {
    controller.each<RouteMetadata>((route, propertyName) => {
      context
        .getFastify()
        .register(createPlugin(controller, route, propertyName))
    })
  })
}
