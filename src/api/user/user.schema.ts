import { z } from 'zod'

export const getOneByName = z.object({
    username: z
        .string({ required_error: 'Nazwa użytkownika jest wymagana.' })
        .min(5)
        .max(25),
})

export type TgetOneByName = z.infer<typeof getOneByName>