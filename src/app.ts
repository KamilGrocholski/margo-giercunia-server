import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import api from './api/index'
import * as middlewares from './middlewares'
import corsOptions from './config/corsOptions'

require('dotenv').config()

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors({ credentials: true, origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL as string : process.env.LOCALHOST_CLIENT as string }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())


app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
