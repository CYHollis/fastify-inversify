import { Container } from 'inversify'
import {
  Controller,
  Get,
  Param,
  InversifyFastify,
  Post,
  Body,
  Valid
} from '../../src/index'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { context } from '../../src/core/app/app-context'

import { describe, it, beforeAll, afterAll } from 'vitest'

class SubmitDTO {
  @IsNotEmpty({ message: '用户名是必填字段' })
  // @IsNotEmpty()
  @IsString({ message: '用户名必须是字符串' })
  @MaxLength(6, { message: '用户名不能大于六个字符' })
  username: string = ''

  @IsNotEmpty({ message: '密码是必填字段' })
  @IsString({ message: '密码必须是字符串' })
  @MaxLength(6, { message: '密码不能大于六位数' })
  password: string = ''
}

@Controller()
class TestController {
  @Get('/hello/:uid')
  sayHello(@Param('uid') uid: string) {
    return `hello ${uid}`
    // return {
    //     uid
    // }
  }

  @Post('/submit')
  submit(@Valid(SubmitDTO) @Body() body: SubmitDTO) {
    return 'success'
  }
}

describe('TestController', () => {
  let app: InversifyFastify
  beforeAll(async () => {
    const container = new Container()
    container.bind(TestController).toSelf().inRequestScope()
    app = new InversifyFastify(container)
    app.setExceptionInterceptor((error: any) => {
      if (error.code === 'VALIDATION_FAILED') {
        return {
          status: 400,
          payload: {
            msg: error.message,
            status: 400,
            data: null
          }
        }
      }
      return {
        status: 500,
        payload: {
          msg: '服务器内部错误',
          status: 500,
          data: null
        }
      }
    })
    await context.getFastify().ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('sayHello', async () => {
    const fastify = context.getFastify()
    const res = await fastify.inject({ method: 'GET', url: '/hello/1' })
    console.log(res.body)
  })
  it('submit', async () => {
    const fastify = context.getFastify()
    const res = await fastify.inject({
      method: 'POST',
      url: '/submit',
      body: {
        username: 2121212,
        password: 2121
      }
    })
    console.log(res.body)
  })
})

// const container = new Container()
// container.bind(TestController).toSelf().inRequestScope()

// const app = new InversifyFastify(container)

// app.setExceptionInterceptor((error: any) => {
//     if (error.code === 'VALIDATION_FAILED') {
//         return {
//             status: 400,
//             payload: {
//                 msg: error.message,
//                 status: 400,
//                 data: null
//             }
//         }
//     }

//     return {
//         status: 500,
//         payload: {
//             msg: '服务器内部错误',
//             status: 500,
//             data: null
//         }
//     }
// })

// app.setResponseInterceptor((payload) => {
//     return {
//         status: 200,
//         msg: 'success',
//         data: payload
//     }
// })

// app.setRequestInterceptor((request, reply) => {
//     // throw new Error('error')
// })

// app.listen({ port: 3000, host: 'localhost' }, async () => {
//     console.log('app is running')
// })
