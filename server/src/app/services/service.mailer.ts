import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'

import { PORT } from '../../config/config.server'
import { MAIL_SERVICE, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_TO, MAIL_CONNECT } from '../../config/config.mailer'


const transporter = nodemailer.createTransport( {
    service: MAIL_SERVICE,
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
} )

export const sendVerifyToEmail = async ( to: string, access_token: string ) => {

    const ejsPath = path.join( __dirname, '../../public/emailVerify-template.ejs' )
    
    const mailOptions = {
        from: MAIL_USER,
        to: to,
        subject: 'Подтверждение регистрации!',
        html: await ejs.renderFile( ejsPath, { MAIL_CONNECT, MAIL_TO, PORT, access_token } )
    }

    return await transporter.sendMail( mailOptions)
}

export const sendRecoveryToEmail = async( to: string, secret_code: string ) => {

    const ejsPath = path.join( __dirname, '../../public/emailRecovery-template.ejs' )

    const mailOptions = {
        from: MAIL_USER,
        to: to,
        subject: 'Восстановление пароля!',
        html: await ejs.renderFile( ejsPath, { secret_code } )
    }

    return await transporter.sendMail( mailOptions)
}