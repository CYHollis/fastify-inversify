# Fastify-DI
![TypeScript](https://img.shields.io/badge/TypeScript->=5-3178C6?logo=typescript&logoColor=white)
![Node.js 20 LTS](https://img.shields.io/badge/Node.js-20_LTS-339933?logo=nodedotjs&logoColor=white)
![Fastify v5](https://img.shields.io/badge/Fastify-v5-000000?logo=fastify&logoColor=white)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

装饰器加依赖注入风格的Fastify框架

## 📋 目录

- [✨ 特性](#特性)
- [📦 安装](#安装)
- [🚀 快速开始](#快速开始)
- [🔧 API 参考](#API-参考)
- [📄 许可证](#许可证)
- [🔗 链接](#链接)
- [📊 版本兼容性](#版本兼容性)

## 特性

- ✅ 依赖注入和 IOC 控制反转
- ✅ 装饰器风格
- ✅ 请求/响应拦截器
- ✅ 错误拦截器


## 安装

```bash
# 使用 npm
npm install @auroravpn/fastify-di inversify

# 使用 yarn
yarn add @auroravpn/fastify-di inversify

# 使用 pnpm
pnpm add @auroravpn/fastify-di inversify
```

## 快速开始
> ⚠️ **警告：** 本项目必须使用Typescript以获得装饰器支持

### 基本使用

```typescript
// 引入包
import { InversifyFastify, Controller, Get } from '@auroravpn/fastify-di'
import { Container } from 'inversify'

// 创建 IOC 容器
const container = new Container()

// 创建应用
const app = new InversifyFastify(container)

// 创建路由
@Controller('/welcome')
class ExampleController {
    @Get('/hello')
    async sayHello() {
        return 'hello'
    }
}

// 启动应用
app.listen({ port: 3000, host: 'localhost' }, () => {
    console.log('App is running at http://localhost:3000')
})
```

### 自动注入参数

```typescript
@Controller('/welcome')
class ExampleController {
    @Get('/hello')
    async sayHello(@Param('uid') uid: string) {
        return `hello ${uid}`
    }
}
```

### 数据验证
你需要通过`class-validator`创建DTO来实现数据验证功能，使用`npm install class-validator`以安装

```typescript
class ExampleDTO {
    @IsNotNull()
    @IsString()
    @MaxLength(6)
    user: string = ''
}

@Controller('/welcome')
class ExampleController {
    @Post('/submit')
    async submit(@Valid(ExampleDTO) @Body() body: ExampleDTO) {
        console.log(body.username)
        return 'success'
    }
}
```

### 拦截器

1. 请求拦截器

```typescript
app.setRequestIntercepetor((request, reply) => {
    // 可以在请求拦截器中鉴权
})
```

2. 响应拦截器
```typescript
app.setResponseInterceptor((payload) => {
    // 统一格式化响应数据
    return {
        status: 200,
        msg: 'success',
        data: payload
    }
})
```

3. 错误拦截器
```typescript
app.setExceptionInterceptor((error: any) => {
    // 统一错误处理
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
```

## API 参考

### 构造函数

#### `new InversifyFastify(container)`
**参数:**
- `container` (Inversify.Container): Inversify容器

### 实例方法

#### `InversifyFastify.listen([opts], [callback])`

**参数：**
- `opts` (object): 配置对象
  - `host` (string): IP地址
  - `port` (number): 端口

**返回值：** (void)

**示例：**
```typescript
app.listen({ port: 3000, host: 'localhost' }, async () => {
    console.log('App is running at http://localhost:3000/')
})
```

#### `InversifyFastify.setRequestIntercepetor(handler)`

**参数：**

- `handler` ((request, reply) => unknown): 请求拦截器处理函数
  - `request` (FastifyRequest): 请求对象
  - `reply` (FastifyReply): 响应对象
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**
```typescript
app.setRequestInterceptor((request, reply) => {
    // throw new Error('error')
})
```

#### `InversifyFastify.setResponseIntercepetor(handler)`

**参数：**

- `handler` ((payload) => unknown): 响应拦截器处理函数
  - `payload` (unkown): 响应载荷
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**

```typescript
app.setResponseInterceptor((payload) => {
    return {
        status: 200,
        msg: 'success',
        data: payload
    }
})
```

#### `InversifyFastify.setExceptionIntercepetor(handler)`

**参数：**

- `handler` ((error) => unknown): 响应拦截器处理函数
  - `error` (unkown): 错误对象
  - **返回值:** (unknown)

**返回值:** (void)

**示例：**

```typescript
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
})
```

### 装饰器

#### 类装饰器
##### `@Controller([prefix])`

标记控制器

**参数：**
- `prefix` (string): 可选, 路由前缀

**示例**

```typescript
@Controller('/test')
class TestController {}
```

#### 方法装饰器
##### `@Get(path)`
路由GET方法

**参数： ** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/submit')
    submit() {
        return 'success'
    }
}
```

##### `@Post(path)`
路由POST方法

**参数： ** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Post('/submit')
    submit() {
        return 'success'
    }
}
```

##### `@Put(path)`
路由PUT方法

**参数：** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Put('/edit')
    edit() {
        return 'success'
    }
}
```

##### `@Delete(path)`

路由DELETE方法

**参数：** `path` (string): 必须, 路由路径

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Put('/delete')
    delete() {
        return 'success'
    }
}
```

#### 参数装饰器
##### `@Param([key])`
获取请求参数

**参数：** `key` (string): 可选, 如果传入, 则返回对应key的参数, 如果不传, 则返回整个params对象

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/user/:uid')
    edit(@Param('uid') uid: string) {
        return uid
    }
}
```

##### `@Header([key])`

获取请求头

**参数：** `key` (string): 可选, 如果传入, 则返回对应key的请求头, 如果不传, 则返回整个headers对象

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/users')
    edit(@Header('token') token: string) {
        return token
    }
}
```

##### `@Body()`

获取请求体

**示例：**

```typescript
@Controller('/test')
class TestController {
    @Get('/user/:uid')
    edit(@Body() body: any) {
        return body
    }
}
```

##### `@Valid([dto])`

数据验证

**参数：** `dto` (object): 必须, 传入`class-validator`创建的`DTO`对象

**示例：**

```typescript
class ExampleDTO {
    @IsNotNull()
    @IsString()
    @MaxLength(6)
    user: string = ''
}

@Controller('/test')
class TestController {
    @Post('/submit')
    async submit(@Valid(ExampleDTO) @Body() body: ExampleDTO) {
        console.log(body.username)
        return 'success'
    }
}
```

## 许可证

本项目基于 [MIT](LICENSE) 许可证。

## 链接

- [GitHub 仓库](https://github.com/cyhollis/fastify-di)

---

**重要提示：** 使用前请确保已阅读相关文档，生产环境请先进行充分测试。

## 版本兼容性

| 版本 | Node.js | Typescript | 备注 |
|------|---------|------------|------------|
| 1.x+ | >= 20 | >= 5 | 第一个正式大版本 |
