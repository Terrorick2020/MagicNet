import { Request, Response } from 'express'


export default {
    isWork: ( _req: Request, res: Response ) => {
        res
            .status( 200 )
            .json({
                message: 'success'
            })
    }
}
