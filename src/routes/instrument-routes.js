import { Router } from 'express'
import { InstrumentController } from '../controllers'

const routes = Router()

routes.post('/', InstrumentController.create)
routes.get('/', InstrumentController.getAll)
routes.get('/:instrumentId', InstrumentController.getById)

export default routes
