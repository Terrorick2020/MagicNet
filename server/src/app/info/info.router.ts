import { Router } from 'express'

import infoController from './info.controller'


const infoRouter = Router()

infoRouter.put( '/info', infoController.updateInfo )

export default infoRouter
