import { AnyZodObject, z } from 'zod'

export const registration = z.object({
    username: z
        .string({ required_error: 'Nazwa użytkownika jest wymagana.' })
        .min(5)
        .max(25),
    email: z
        .string()
        .email('Adres e-mail jest wymagany.'),
    password: z
        .string({ required_error: 'Hasło jest wymagane.' })
        .min(8)
        .max(50)
})
export type Tregistration = z.infer<typeof registration>

export const login = z.object({
    username: z
        .string({ required_error: 'Nazwa użytkownika jest wymagana.' })
        .min(5)
        .max(25),
    password: z
        .string({ required_error: 'Hasło jest wymagane.' })
        .min(8)
        .max(50)
})
export type Tlogin = z.infer<typeof login>

