import { Request, Response, NextFunction } from "express"
import { isDev } from "../../config/config.server"
import type { IMagicNetError, IErrorResponse } from "../../types/type.error"


export const errorHandler = ( err: IMagicNetError, _req: Request, res: Response, _next: NextFunction ) => {
    const errResponse: IErrorResponse = {
        message: err.message
    }

    if ( isDev ) {
        errResponse.stack = err.stack ? err.stack : 'Not found this url!'
    }

    res
        .status( err.statusCode )
        .json({
            ...errResponse
        })
}
