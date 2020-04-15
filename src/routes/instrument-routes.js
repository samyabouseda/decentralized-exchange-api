import { Router } from 'express'
import { InstrumentController } from '../controllers'

const routes = Router()

routes.post('/', InstrumentController.create)
routes.get('/', InstrumentController.getAll)
routes.get('/:instrumentId', InstrumentController.getById)
routes.post(
	'/fiat/:instrumentSymbol',
	InstrumentController.purchaseFiat,
)
routes.post(
	'/deposit/:instrumentSymbol',
	InstrumentController.depositFiat,
)

export default routes
