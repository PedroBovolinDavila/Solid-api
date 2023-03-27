import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

interface CheckInUseCaseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCaseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseCaseRequest): Promise<CheckInUseCaseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
