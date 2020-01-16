import { Router } from 'express'
import { OK } from 'http-status-codes'
import userRoutes from './user-routes'
import instrumentRoutes from './instrument-routes'

const router = Router()
router.get('/', (req, res) => {
	res.status(OK).json({ message: 'Connected' })
})

// ADD ROUTES HERE
router.use('/accounts', userRoutes)
router.use('/instruments', instrumentRoutes )

export default router
