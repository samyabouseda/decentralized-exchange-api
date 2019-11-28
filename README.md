# Express & ES6 REST API Boilerplate

A straightforward boilerplate for building REST APIs with javascript ES6 and Express.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing 
purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Installation

```sh
# clone it
git clone git@github.com:samyabouseda/node-express-rest-api-boilerplate.git
cd node-express-rest-api-boilerplate

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Add .env file to the root folder
touch .env

# Add env variables to .env file for port and database url
PORT=<port_nuber>
DATABASE_URL=<db_url>

# Start mongodb on your local machine
mongod

# Start development live-reload server
npm start

# Docker support
more to come...
```    

## Usage
Create a new file named `Book.js` in the `models` folder.
To learn more about creating models, check the [mongoose documentation](https://mongoosejs.com).
```js
import { Schema, model } from 'mongoose'

const bookSchema = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        unique: true,
    },
})

const Book = model('Book', bookSchema)

export default Book

```
Add a new file named `book-controller.js` in the `controllers` folder.
Create a controller for the `Book` model in that file. To learn more about creating controllers, check the [Express documentation](https://expressjs.com/en/guide/routing.html).
```js
const getAll = async (req, res) => {
    const books = await req.context.models.Book.find()
    return res.send(books)
}

const getById = async (req, res) => {
    const book = await req.context.models.Book.findById(
    	req.params.bookId,
    )
    return res.send(book)
})

export default { getAll, getById }
```

Create a new file named `book-routes.js` in the `routes` folder. Link the newly created controller to the routes.
```js
import { Router } from 'express'
import { BookController } from '../controllers'

const routes = Router()

routes.post('/', BookController.getAll)
routes.get('/:bookId', BookController.getById)

export default routes

```

Add the new endpoint to `index.js` file in the `routes` folder.
```js
import bookRoutes from '../bookRoutes'

router.use('/books', bookRoutes)
```
## Database 

### Seeding
You can seed the database by following these steps.

Create a new file named `1_Book.seed.js` in the `seeds` directory located inside the database package.

The file must be named after the following pattern `<NUMBER>_<Model>.seed.js`

- The `number` represent the order by which the seed files will be processed (inserted inside the db). This is important for 
models that contains references to other models (foreign keys).

- The `model` is the name of the model that will be seeded. Is MUST start with an uppercase.

Add the data to this file.
```javascript
export default {
    model: 'Book',
    data: [
        { 
            id: 1,
            title: 'Zero to One'
        },
        { 
            id: 2,
            title: 'The lean startup'
        },     
    ]   
}
``` 

And that's it ! Now when you run the server in development mode, the database will contain the data.

### Migration
more to come...

## Tests

### Running the tests
```
npm test
```

### Testing the API
more to come...

## Deployment

Create a new heroku app.
https://devcenter.heroku.com/articles/git#for-a-new-heroku-app
```
heroku create the-name-of-your-app
```

Add the MondoDB addon.
https://elements.heroku.com/addons/mongolab
```
heroku addons:create mongolab:sandbox
```

Deploy your app. https://devcenter.heroku.com/articles/git#deploying-code
```
git push heroku master
```

Open the app in your favourite browser.
```
heroku open
```

Or get the url with the following command
```
heroku apps:info
```

## Built with
- [Express](https://expressjs.com) - The web framework for [Node.js](https://nodejs.org/en/)
- [Babel](https://babeljs.io) - To support ES6 syntax
- [Cors](https://github.com/troygoode/node-cors) - For CORS support 
- [Nodemon](https://nodemon.io) - For automatic server restart on file change
- [Mongoose](https://mongoosejs.com) - Mongodb object modeling
- [Heroku](https://www.heroku.com) - Platform to deploy, manage and scale apps
- [Jest](https://jestjs.io) - JavaScript Testing Framework
- [Prettier](https://prettier.io) - Code formater 

## Author

* **Samy Abouseda** - [samyabouseda](https://github.com/samyabouseda)

## License

[MIT](LICENSE.md)