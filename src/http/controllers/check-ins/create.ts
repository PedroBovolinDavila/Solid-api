import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createCheckInBodySchema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
    const { gymId } = createCheckInParamsSchema.parse(request.params)

    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
      userId: request.user.sub,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: err.message,
      })
    }

    if (err instanceof MaxDistanceError || err instanceof MaxDistanceError) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }
}
