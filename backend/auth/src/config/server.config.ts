import dotenv from 'dotenv'

dotenv.config({ path: '.env' })


export const API_VERSION  = String( process.env.API_VERSION )
export const NODE_ENV     = String( process.env.NODE_ENV ) || 'development'
export const isDev        = NODE_ENV === 'development'

export const API_HOST   = String( process.env.API_HOST )   || 'localhost'
export const API_PORT   = Number( process.env.API_PORT )   || 3000 
export const API_PREFIX = String( process.env.API_PREFIX ) || ''

export const SWAGGER_LOGIN    = String( process.env.SWAGGER_LOGIN )
export const SWAGGER_PASSWORD = String( process.env.SWAGGER_PASSWORD )

export const REDIS_HOST = String( process.env.REDIS_HOST )
export const REDIS_PORT = Number( process.env.REDIS_PORT )

if (
    !SWAGGER_LOGIN ||
    !SWAGGER_PASSWORD ||
    !REDIS_HOST ||
    !REDIS_PORT
) {
    throw new Error( 'There are no constants of the built environment!' )
}
