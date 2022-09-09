import { z } from 'zod'

export const create = z.object({
    name: z
        .string()
        .min(1),
    lvl: z
        .number()
        .positive('Poziom musi być liczbą całkowitą, większą od zera.'),
    img: z
        .string(),
    type: z
        .enum(['T', 'K'])
})
export type Tcreate = z.infer<typeof create>