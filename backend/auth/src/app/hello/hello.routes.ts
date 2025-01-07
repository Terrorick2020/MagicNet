import { Router } from 'express'
import { MNRoutes } from '../../config/routes.config'

import helloController from './hello.controller'


const helloRoutes = MNRoutes.hello.local
const helloRouter = Router()

helloRouter.get( helloRoutes.isWork, helloController.isWork )

export default helloRouter
