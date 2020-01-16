import { Router } from 'express'
import { InstrumentController } from '../controllers'

const routes = Router()

routes.post('/', InstrumentController.create)

export default routes
