import { Router } from 'express'
import { UserController } from '../controllers'

const routes = Router()

routes.post('/', UserController.create)
routes.get('/', UserController.getAll)
routes.get('/:userId', UserController.getById)
routes.put('/:userId', UserController.update)
routes.delete('/:userId', UserController.remove)

export default routes
