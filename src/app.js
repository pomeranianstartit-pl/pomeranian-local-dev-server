import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json' assert { type: 'json' }
import { addAppRouters } from './app/index.js'
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'));
app.use(cors())
app.use(express.json())

app.all('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' })
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const routes = await addAppRouters()
app.use('/api', routes)

const port = process.env.port || 3333
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
