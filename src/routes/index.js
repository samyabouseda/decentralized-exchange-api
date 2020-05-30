import { Router } from 'express'
import { OK } from 'http-status-codes'
import userRoutes from './user-routes'
import instrumentRoutes from './instrument-routes'
import orderRoutes from './order-routes'

const router = Router()
router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

// ADD ROUTES HERE
router.use('/accounts', userRoutes)
router.use('/instruments', instrumentRoutes)
router.use('/orders', orderRoutes)

export default router
