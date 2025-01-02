import { Request, Response } from 'express'
import { verifyToken } from '../middlewares/auth.middleware'
import { ACCESS } from '../../config/config.auth'
import { prisma } from '../prisma'

import asyncHandler from 'express-async-handler'

import type { UserInfo } from '../../types/type.info'


export default {
    updateInfo: asyncHandler( async ( req: Request, res: Response ) => {
        const { data } : { data: UserInfo } = req.body

        let access_token
        let userFound

        if( req.headers.authorization?.startsWith('Bearer') ) {
            access_token = req.headers.authorization.split( ' ' )[1]
        }
        
        if ( access_token ) userFound = await verifyToken( access_token, ACCESS )

        const result = await prisma.info.update({
            where: {
                userId: userFound?.id
            },
            data: { ...data }
        })

        res.status( 200 ).json( { message: 'updated info' } )
    } )
}