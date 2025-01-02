import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'

import asyncHandler from 'express-async-handler'

import { verifyToken } from '../middlewares/auth.middleware'
import { ACCESS } from '../../config/config.auth'
import { prisma } from '../prisma'
import { DocFields } from '../utils/user.utils'

import { DATABASE_ERROR, INNER_SERVICE_ERROR } from '../../config/config.error'

import type { User } from '../../types/type.auth'
import type { ResLoadData } from '../../types/type.docs'


export default {
    getDoc: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params

            const doc = await prisma.docs.findUnique({
                where: {
                    id: Number( id )
                },
                select: DocFields
            })

            console.log( doc )

            res.status( 200 ).json(
                {
                    data: doc,
                    message: 'get doc'
                }
            )
        }
    ),
    downloadDocs: asyncHandler( 
        async ( req: Request, res: Response ) => {
            let access_token
            let resData: ResLoadData[]  = []
            let userFound: User | null = null
            let files: UploadedFile | UploadedFile[] = []

            if( req.headers.authorization?.startsWith('Bearer') ) {
                access_token = req.headers.authorization.split( ' ' )[1]
            }
            
            if ( access_token ) userFound = await verifyToken( access_token, ACCESS )

            if( req.files ) {
                if ( Array.isArray( req.files[ 'files[]' ] ) ) {
                    files = req.files[ 'files[]' ]
                } else {
                    files = [ req.files[ 'files[]' ] ]
                }
            } 

            const now = new Date()
            const nowMs = BigInt( now.getTime() )

            try {

                for (const file of files) {
                    const foundFile = await prisma.docs.findMany({
                        where: { name: String( file.name ) }
                    })
    
                    if (!foundFile.length && userFound?.id) {
                        const loadRes = await prisma.docs.create({
                            data: {
                                name: file.name,
                                data: file.data,
                                date: nowMs,
                                size: file.size,
                                mimetype: file.mimetype,
                                userId: userFound?.id
                            }
                        })
            
                        if (!loadRes) {
                            throw DATABASE_ERROR
                        }
            
                        resData.push(
                            {
                                id: loadRes.id,
                                formatDate: loadRes.createdAt
                            }
                        )
                    } else {
                        console.log(`File ${file.name} already exists`)
                    }
                }

            } catch( err ) {
                throw INNER_SERVICE_ERROR
            }            

            res.status( 200 ).json(
                {
                    resData,
                    message: 'updated docs'
                }
            )
        } 
    ),
    deleteDoc: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params
            
            await prisma.docs.delete({
                where:{
                    id: Number( id )
                }
            })
            
            res.status( 200 ).json( { message: 'delete doc' } )
        }
    )
}