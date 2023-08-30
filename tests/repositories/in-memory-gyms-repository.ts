import ExtendedSet from '@cahmoraes93/extended-set'
import { GymsRepository } from '@/application/repositories/gyms-repository'
import { Gym } from '@/application/entities/gym'

export class InMemoryGymsRepository implements GymsRepository {
  public data: ExtendedSet<Gym> = new ExtendedSet()

  async create(aGym: Gym): Promise<Gym> {
    this.data.add(aGym)
    return aGym
  }

  async gymOfId(anId: string): Promise<Gym | null> {
    return this.data.find((gym) => gym.id.toString() === anId)
  }
}
