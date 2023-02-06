import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
const app = express()
import UserRoute from './routes/usersRoute.js'
import { connectDB } from './config/db.js'

//setup cors permission
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('welcome to theCoded system backend api')
})

//User Routes
app.use('/api/v1/users', UserRoute)

//Other Invalid Endpoints
app.all('*', async (req, res) => {
  try {
    res.status(404)
    throw new Error('Invalid Expoint. ')
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    })
  }
})

const start = async (port) => {
  try {
    const conn = await connectDB()
    app.listen(port, (err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('Server up and running successfully')
    })

    console.log(`Connection To database was successful. Up and Runnung`)
  } catch (err) {
    console.log(`${err}`)
  }
}

const PORT = process.env.PORT || 3000

start(PORT)
