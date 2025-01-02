import { Request, Response } from 'express'
import { hash, verify } from 'argon2'

import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma'
import { redis } from '../redis'
import { FormatDocs } from '../../types/type.docs'
import { InfoFields, ConfigFields, UserFields, DocsFields } from '../utils/user.utils'
import { sendVerifyToEmail, sendRecoveryToEmail } from '../services/service.mailer'
import { verifyToken } from '../middlewares/auth.middleware'
import { 
    ACCESS,
    REFRESH,
    RESET,
    REFRESH_MS,
    RESET_MS
    }  from '../../config/config.auth'

import {
    EMAIL_ALREADY_EXISTS,
    DATABASE_ERROR,
    REDIS_ERROR,
    TOKEN_EXPIRED,
    EMAIL_NOT_VERIFIED, 
    INVALID_CREDENTIALS,
    INNER_SERVICE_ERROR,
    SECRET_CODE_NOT_VERIFIED,
} from '../../config/config.error'

import Generator from './auth.generator'

import type { SingUpDataType } from '../../types/type.auth'
import type { User } from '../../types/type.auth'

export default {
    singUp: asyncHandler( 
        async ( req: Request, res: Response ) => {
            const data: SingUpDataType = req.body

            const sphereDef = data.sphereDef
            const direction = data.direction
            const email = data.email
            const password = data.password

            const isHaveUser = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if( isHaveUser ) {
                throw EMAIL_ALREADY_EXISTS
            }

            const userFound = await prisma.user.create({
                data: {
                    email,
                    password: await hash( password )
                }
            })

            const info = await prisma.info.create({
                data: {
                    sphereDef,
                    direction,
                    userId: userFound.id
                }
            })

            const config = await prisma.config.create({
                data: {
                    userId: userFound.id
                }
            })

            if( !userFound || !info || !config ) {
                throw DATABASE_ERROR
            }

            const access_token = Generator.generateToken( userFound.id, ACCESS )
            const refresh_token = Generator.generateToken( userFound.id, REFRESH )
            const emailRespose = await sendVerifyToEmail( email, access_token )

            if( !emailRespose ) {
                await prisma.user.delete({
                    where: {
                        id: userFound.id
                    }
                })

                res.status( 504 ).json(
                    {
                        error: 'Server problems, try again later..',
                        status: 'Registration error!'
                    }
                )
                throw DATABASE_ERROR
            }

            const redisResponse = await redis.set(
                `refresh_tokens:${ userFound.id }`,
                `${refresh_token}`,
                'EX',
                REFRESH_MS
            )

            if( !redisResponse ) {
                throw REDIS_ERROR
            }

            res.cookie('refresh', refresh_token, {
                maxAge: REFRESH_MS,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })

            res.setHeader('Authorization', `Bearer ${access_token}`)

            res.status( 200 ).json(
                {
                    accessToken: access_token,
                    message: 'success'
                }
            )
        }
    ),

    verifyEmail: asyncHandler( 
        async (req: Request, res: Response) => {
            const access_token = String( req.query.access_token )
            
            const userFound = await verifyToken( access_token, ACCESS )

            if ( !userFound ) {
                throw TOKEN_EXPIRED
            }

            await prisma.user.update({
                data: {
                    isVerify: true
                },
                where: { 
                    id: userFound.id
                }
            })

            res.status( 201 ).json( {message: 'success' } )
        } 
    ),

    singIn: asyncHandler( 
        async ( req: Request, res: Response ) => {
            const { email, password } = req.body

            const userFound = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if( !userFound?.isVerify ) {
                throw EMAIL_NOT_VERIFIED
            }

            const isValidUserPassword = await verify( userFound?.password ? userFound.password : '', password )

            if( !userFound || !isValidUserPassword ) {
                throw INVALID_CREDENTIALS
            }

            const info = await prisma.info.findUnique({
                where: { 
                    userId: userFound.id
                },
                select: InfoFields
            })

            const config = await prisma.config.findUnique({
                where: {
                    userId: userFound.id
                },
                select: ConfigFields
            })

            const docs = await prisma.docs.findMany({
                where: {
                    userId: userFound.id
                },
                select: DocsFields
            })

            const newDocs: FormatDocs[] = []

            docs.map(
                item => {
                    newDocs.push( {
                        id: item.id,
                        headline: item.name,
                        date: Number(item.date),
                        formatDate: item.createdAt,
                    })
                }
            )

            if( !info || !config ) {
                throw DATABASE_ERROR
            }

            const access_token = Generator.generateToken( userFound.id, ACCESS )
            const refresh_token = Generator.generateToken( userFound.id, REFRESH )

            const redisResponse = await redis.set(
                `refresh_tokens:${ userFound.id }`,
                `${refresh_token}`,
                'EX',
                REFRESH_MS
            )

            if( !redisResponse ) {
                throw REDIS_ERROR
            }

            res.cookie('refresh', refresh_token, {
                maxAge: REFRESH_MS,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })

            res.setHeader('Authorization', `Bearer ${access_token}`)

            res.status( 201 ).json(
                { 
                    id: userFound.id,
                    email: userFound.email,
                    role: userFound.role,
                    accessToken: access_token,
                    docs: newDocs,
                    ...info,
                    ...config,
                    message: 'success'
                } 
            )
        } 
    ),

    updateTokens: asyncHandler( 
        async ( req: Request, res: Response ) => {
            let access_token
            let refresh_token = req.cookies.refresh

            const userFound = await verifyToken( refresh_token, REFRESH )

            if ( !userFound ) {
                throw TOKEN_EXPIRED
            }        

            let redisRefresh = await redis.get( `refresh_tokens:${ userFound.id }` )

            if( redisRefresh !== refresh_token ) {
                throw new Error( 'Incorrect refresh token!' )
            }

            access_token = Generator.generateToken( userFound.id, ACCESS )
            refresh_token = Generator.generateToken( userFound.id, REFRESH )

            const redisResponse = await redis.set(
                `refresh_tokens:${ userFound.id }`,
                `${refresh_token}`,
                'EX',
                REFRESH_MS
            )

            if( !redisResponse ) {
                throw REDIS_ERROR
            }

            res.cookie('refresh', refresh_token, {
                maxAge: REFRESH_MS,
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            })

            res.setHeader('Authorization', `Bearer ${access_token}`)

            res.status( 200 ).json(
                {
                    accessToken: access_token,
                    message: 'success'
                }
            )
        } 
    ),

    deleteUser: asyncHandler( 
        async ( req: Request, res: Response ) => {
            let access_token
            let userFound: User | null = null

            if( req.headers.authorization?.startsWith('Bearer') ) {
                access_token = req.headers.authorization.split( ' ' )[1]
            }
            
            if ( access_token ) userFound = await verifyToken( access_token, ACCESS )

            const delRes = await prisma.user.delete({
                where: {
                    id: userFound?.id
                }
            })

            if( !delRes ) {
                throw DATABASE_ERROR
            }

            res.status( 200 ).json( { message: 'success' } )
        } 
    ),

    sendSecretCodeToEmail: asyncHandler( 
        async ( req: Request, res: Response ) => {
            const { email } = req.body

            const userFound = await prisma.user.findUnique({
                where: {
                    email
                },
                select: UserFields
            })

            if( !userFound ) {
                throw EMAIL_NOT_VERIFIED
            }

            const secret_code = Generator.generateSecretCode()

            const emailRespose = await sendRecoveryToEmail( email, secret_code )

            if( !emailRespose ) {
                throw INNER_SERVICE_ERROR
            }

            const redisResponse = await redis.set(
                `secret_code:${ userFound.id }`,
                `${secret_code}`,
                'EX',
                RESET_MS
            )

            if( !redisResponse ) {
                throw REDIS_ERROR
            }

            res.status( 202 ).json( { message: 'success' } )
        } 
    ),

    verifyCode: asyncHandler( 
        async ( req: Request, res: Response ) => {
            const { email , secret_code } = req.body

            const userFound = await prisma.user.findUnique({
                where: {
                    email
                }, 
                select: UserFields
            })

            if( !userFound ) {
                throw EMAIL_NOT_VERIFIED
            }

            const redisSecret = await redis.get( `secret_code:${ userFound.id }` )

            if( secret_code !== redisSecret ) {
                throw SECRET_CODE_NOT_VERIFIED
            }

            const reset_token = Generator.generateToken( userFound.id, RESET )

            res.setHeader('Authorization', `Bearer ${reset_token}`)

            res.status( 201 ).json( { message: 'success'} )
        } 
    ),

    rewritePass: asyncHandler( async ( req: Request, res: Response ) => {
        const { password } = req.body

        let reset_token
        let userFound: User | null = null

        if( req.headers.authorization?.startsWith('Bearer') ) {
            reset_token = req.headers.authorization.split( ' ' )[1]
        }
        
        if ( reset_token ) userFound = await verifyToken( reset_token, RESET )

        if( !userFound ) {
            throw TOKEN_EXPIRED
        }

        const dbRes = await prisma.user.update({
            where: {
                id: userFound?.id
            },
            data: {
                password
            }
        })

        if( !dbRes ) {
            throw DATABASE_ERROR
        }

        res.status( 200 ).json( { message: 'success' } )
    } )
}
