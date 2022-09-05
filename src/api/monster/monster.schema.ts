import { z } from 'zod'

export const create = z.object({
    name: z
        .string({ required_error: 'Nazwa jest wymagana.' })
        .min(1),
    lvl: z
        .number({ required_error: 'Poziom jest wymagany.' })
        .positive('Poziom musi być liczbą całkowitą, większą od zera.'),
    img: z
        .string({ required_error: 'Link do grafiki jest wymagany.' }),
    type: z
        .enum(['T', 'K'])
})
export type Tcreate = z.infer<typeof create>