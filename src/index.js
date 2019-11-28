import chalk from 'chalk'
import config from '../config'
import connectDb from './database'
import app from './app'
const pkg = require('../package')

connectDb().then(async () => {
	app.listen(config.app.PORT, () => {
		console.log(`The service ${chalk.bold(pkg.name)} started successfully!`)
		console.log()
		console.log(`  ${chalk.bold('Database is connected at')} ${chalk.blue(config.db.DATABASE_URL)}`)
		console.log(`  ${chalk.bold('Development server is running at')} http://127.0.0.1:${config.app.PORT}`)
		console.log()
		if(process.env.NODE_ENV === 'development') {
			console.log('Note that the development build is not optimized.')
			console.log(`To create a production build, use ${chalk.cyan('npm run build')}.`)
		}
	})
})
