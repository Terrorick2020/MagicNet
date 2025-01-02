import { Router } from 'express'

import otherController from './other.controller'


const otherRouter = Router()

otherRouter.all( '*', otherController.otherResponse )

export default otherRouter
