import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { MainHttpController } from './infra/http/controllers/main-http-controller'
import { FastifyAdapter } from './infra/http/servers/fastify/fastify-adapter'
import { AuthenticateUseCase } from './application/use-cases/authenticate.usecase'
import { provide } from './infra/dependency-inversion/registry'
import { PrismaUsersRepository } from './infra/repositories/prisma/prisma-users-repository'
import { GetUserMetricsUseCase } from './application/use-cases/get-user-metrics.usecase'
import { InMemoryCheckInsRepository } from '@/tests/repositories/in-memory-check-ins-repository'

provide('usersRepository', new PrismaUsersRepository())
provide('createUserUseCase', new CreateUserUseCase())
provide('authenticateUseCase', new AuthenticateUseCase())
provide('checkInsRepository', new InMemoryCheckInsRepository())
provide('getUserMetricsUseCase', new GetUserMetricsUseCase())
const httpServer = new FastifyAdapter()
new MainHttpController(httpServer)
httpServer.listen()
