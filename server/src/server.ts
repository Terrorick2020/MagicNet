import express from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import homeRouter from './app/home/home.router'
import authRouter from './app/auth/auth.router'
import configRouter from './app/config/config.router'
import infoRouter from './app/info/info.router'
import docsRouter from './app/docs/docs.router'
import otherRouter from './app/other/other.router'

import {
  PORT,
  HOST,
  POSTFIX,
  isDev
} from './config/config.server'

import { prisma } from './app/prisma'
import { redis } from './app/redis'
import { errorHandler } from './app/middlewares/error.middleware'


const start = async () => {
  const app = express()

  app.use( express.static('./src/public/data') )
  app.use( express.json() )
  app.use( cookieParser() )
  app.use( helmet() )

  if( isDev ) app.use( morgan( 'dev' ) )
  if( isDev ) app.use( cors() )

  app.use( fileUpload() )

  app.use( `/${POSTFIX}`, homeRouter )
  app.use( `/${POSTFIX}/auth`, authRouter )
  app.use( `/${POSTFIX}`, configRouter )
  app.use( `/${POSTFIX}`, infoRouter )
  app.use( `/${POSTFIX}`, docsRouter )
  app.use( otherRouter )

  app.use( errorHandler )


  app.listen( PORT, HOST, () => {
    console.log( `\n🚀 Сервер запущен по адресу: http://${ HOST }:${ PORT }/${POSTFIX}\n` )
  } )
}

start()
  .then( async () => {
    await prisma.$disconnect()
  })
  .catch( async err => {
    console.debug( err )
    await prisma.$disconnect
    await redis.quit
    process.exit( 1 )
  })
