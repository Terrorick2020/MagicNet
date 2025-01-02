import dotenv from 'dotenv'

dotenv.config({ path: '.env' })


export const MAIL_SERVICE = String( process.env.EMAIL_SERVICE ) || 'yandex'
export const MAIL_HOST = String( process.env.EMAIL_HOST )       || 'smtp.yandex.ru'
export const MAIL_PORT = Number( process.env.EMAIL_PORT )       || 993
export const MAIL_TO  = String( process.env.EMAIL_TO )          || 'localhost'
export const MAIL_CONNECT = String( process.env.EMAIL_CONNECT ) || 'http'
export const MAIL_USER = String( process.env.EMAIL_USER )
export const MAIL_PASS = String( process.env.EMAIL_PASS  )

if(
    !MAIL_SERVICE ||
    !MAIL_HOST    ||
    !MAIL_PORT    ||
    !MAIL_TO      ||
    !MAIL_CONNECT ||
    !MAIL_USER    ||
    !MAIL_PASS
) {
    throw new Error( 'Don`t have one of the mail configs!' )
} 
