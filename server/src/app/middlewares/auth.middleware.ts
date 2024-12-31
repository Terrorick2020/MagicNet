import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { prisma } from '../prisma'
import { UserFields } from '../utils/user.utils'
import { tokenVariant } from '../../config/config.auth'


export const verifyToken = async ( token: string, variant: string ) => {

    let secret = tokenVariant[ variant ].secret

    const decoded = jwt.verify( token, secret ) as { userId: string }

    if( !decoded ) {
        throw new Error( 'Server Error!' )
    }

    const userFound = await prisma.user.findUnique({
        where: {
            id: Number( decoded.userId ) 
        },
        select: UserFields
    })

    return userFound
}

export const protect = asyncHandler( async (req: Request, res:Response, next: NextFunction) => {

    let token
    let variant

    if( req.headers.authorization?.startsWith('Bearer') ) {
        token = req.headers.authorization.split( ' ' )[1]
    }

    if( !token ) {
        res.status( 401 )
        throw new Error('Not authorized, I don`t have a token!')
    }

    if( req.path === '/rewrite-pass' ) {
        variant = 'reset'
    } else {
        variant = 'access'
    }

    const userFound = await verifyToken( token, variant )

    if ( userFound ) {
        (req as any).user = userFound;
        next()
    } else {
        res.status( 401 )
        throw new Error('Not authorized, token failed')
    }
} )
