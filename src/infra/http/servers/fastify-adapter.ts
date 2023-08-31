import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import {
  HTTPMethodTypes,
  HttpHandler,
  HttpServer,
  JwtHandlers,
} from './http-server'
import { env, isProduction } from '@/env'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'

interface JwtSignIn {
  (payload: object, options?: object): Promise<string>
}

export class FastifyAdapter implements HttpServer {
  private httpServer = Fastify()

  constructor() {
    this.registerJWT()
    this.errorHandler()
  }

  async listen(): Promise<void> {
    try {
      await this.performListen()
    } catch (error) {
      console.error(error)
    }
  }

  private registerJWT(): void {
    this.httpServer.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    })
  }

  private errorHandler() {
    this.httpServer.setErrorHandler(function (error, request, reply) {
      if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        this.log.error(error)
        return reply.status(500).send({ ok: false })
      }
      if (error instanceof ZodError) {
        return reply
          .status(400)
          .send({ message: 'Validation error', issues: error.format() })
      }

      if (!isProduction()) {
        console.error(error)
      }

      return reply.status(500).send({ message: 'Internal Server Error' })
    })
  }

  private async performListen(): Promise<void> {
    await this.httpServer.listen({ port: env.PORT, host: env.HOST })
    console.log(`🚀 Server is running on http://${env.HOST}:${env.PORT}`)
  }

  public on(
    method: HTTPMethodTypes,
    route: string,
    handler: HttpHandler,
  ): void {
    this.httpServer[method](route, async (request, reply) => {
      const response = await handler(
        request.body,
        request.params,
        this.jwtHandler(request, reply),
      )
      if (response.isLeft()) {
        return reply.status(response.value.status).send(response.value.toDto())
      }
      reply.status(response.value.status).send(response.value.data)
    })
  }

  private jwtHandler(
    fastifyRequest: FastifyRequest,
    fastifyReply: FastifyReply,
  ): JwtHandlers {
    const fastifyJwtSign = fastifyReply.jwtSign.bind(fastifyReply)
    return {
      async sign(payload, options) {
        return fastifyJwtSign(payload, options)
      },
      async verify(payload) {
        return fastifyRequest.jwtVerify(payload)
      },
    }
  }
}
