import { Router } from 'express'
import { AccountController } from '../controllers'

const routes = Router()

routes.post('/', AccountController.create)
routes.get('/', AccountController.getAll)

export default routes
