import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'

import homeRouter from './app/home/home.router'
import authRouter from './app/auth/auth.router'

import { prisma } from './app/prisma'
import { notFound, errorHandler } from './app/middlewares/error.middleware'


dotenv.config({ path: 'src/.env' })
const PORT: number     = Number( process.env.PORT )     || 3000
const HOST: string     = String( process.env.HOST )     || '127.0.0.1'
const NODE_ENV: string = String( process.env.NODE_ENV ) || 'development'
const isDev = NODE_ENV === 'development'


const start = async () => {
  const app = express()

  app.use( express.json() )

  if( isDev ) app.use( morgan( 'dev' ) )
  if( isDev ) app.use( cors() )

  app.use( '/api', homeRouter )
  app.use( '/api/auth', authRouter )

  app.use( notFound )
  app.use( errorHandler )


  app.listen( PORT, HOST, () => {
    console.log( `\n🚀 Сервер запущен по адресу: http://${ HOST }:${ PORT }/api\n` )
  } )
}

start()
  .then( async () => {
    await prisma.$disconnect()
  })
  .catch( async err => {
    console.debug( err )
    await prisma.$disconnect
    process.exit( 1 )
  })