import { AuthenticateUseCase } from '@/application/use-cases/authenticate.usecase'
import { CreateGymUseCase } from '@/application/use-cases/create-gym.usecase'
import { CreateUserUseCase } from '@/application/use-cases/create-user.usecase'
import { FetchNearbyGymsUseCase } from '@/application/use-cases/fetch-nearby-gym.usecase'
import { GetUserMetricsUseCase } from '@/application/use-cases/get-user-metrics.usecase'
import { GetUserProfileUseCase } from '@/application/use-cases/get-user-profile.usecase'
import { SearchGymsUseCase } from '@/application/use-cases/search-gyms.usecase'
import { provide } from '@/infra/dependency-inversion/registry'
import { PrismaCheckInsRepository } from '@/infra/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/infra/repositories/prisma/prisma-gyms-repository'
import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'

export function provideDependencies() {
  provide('usersRepository', new PrismaUsersRepository())
  provide('gymsRepository', new PrismaGymsRepository())
  provide('checkInsRepository', new PrismaCheckInsRepository())
  provide('createUserUseCase', new CreateUserUseCase())
  provide('authenticateUseCase', new AuthenticateUseCase())
  provide('getUserMetricsUseCase', new GetUserMetricsUseCase())
  provide('getUserProfileUseCase', new GetUserProfileUseCase())
  provide('createGymUseCase', new CreateGymUseCase())
  provide('searchGymsUseCase', new SearchGymsUseCase())
  provide('fetchNearbyGymsUseCase', new FetchNearbyGymsUseCase())
}
