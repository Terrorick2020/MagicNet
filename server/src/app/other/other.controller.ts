import { Request, Response } from 'express'

import asyncHandler from 'express-async-handler'


export default {
    otherResponse: asyncHandler( 
        async (req: Request, res: Response) => {
            res
                .status( 404 )
                .json({
                    message: `Not found - ${ req.originalUrl }`
                })
        }
    )
}
