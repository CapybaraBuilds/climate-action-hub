require('dotenv').config()
const PORT = process.env.PORT
const express = require('express')
const connectDB = require('./config/database')
const logger = require('./middleware/logger')
const app = express()
connectDB()
app.use(express.json())
app.use(logger)

const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.use((err, req, res, next)=>{
    console.log(err.stack)
    res.status(500).json({error: 'Something went wrong'})
})

app.listen(PORT, ()=>{
    console.log(`Application is listening on port ${PORT}`)
})