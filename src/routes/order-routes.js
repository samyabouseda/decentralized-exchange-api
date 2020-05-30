import { Router } from 'express'
import { OrderController } from '../controllers'

const routes = Router()

routes.post('/', OrderController.placeOrder)

export default routes
