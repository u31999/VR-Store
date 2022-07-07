import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import productRoutes from './routes/products.js'
import userRoutes from './routes/usersRoute.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Welcome To VR-Store')
})



app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)


app.use(notFound)

app.use(errorHandler)

app.listen(PORT, console.log(`Server is running in 
${process.env.NODE_ENV} on port: ${PORT}`.yellow.bold))