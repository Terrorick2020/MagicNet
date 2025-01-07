import express from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import morgan from 'morgan'

import swaggerModule from './app/swagger'
import helloRouter from './app/hello/hello.routes'

import {
    API_HOST,
    API_PORT,
    API_PREFIX,
    isDev
} from './config/server.config'

import { MNRoutes } from './config/routes.config'
import { prisma } from './app/prisma'
import { redis } from './app/redis'


const swaggerGlobal = MNRoutes.swagger.global
const helloGlobal = MNRoutes.hello.global

const start = async () => {
    const app = express()

    app.use( express.json() )

    if( isDev ) app.use( morgan( 'dev' ) )
    if( isDev ) app.use( cors() )

    app.use(
        `/${swaggerGlobal}`,
        swaggerModule.auth,
        swaggerUi.serve,
        swaggerUi.setup( swaggerModule.specs )
    )

    app.use( `${ API_PREFIX }/${ helloGlobal }`, helloRouter )

    app.listen( API_PORT, API_HOST, () => {
        console.log( `\n🚀 Сервер запущен по адресу: http://${ API_HOST }:${ API_PORT + API_PREFIX }` )
        if( isDev ) console.log( `📕 Документация: http://${ API_HOST }:${ API_PORT }/${swaggerGlobal}\n` )
    })
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
