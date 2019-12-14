import { Router } from 'express'
import { AccountController } from '../controllers'

const routes = Router()

routes.post('/', AccountController.create)
routes.get('/', AccountController.getAll)
routes.get('/:privateKey', AccountController.login)

export default routes
