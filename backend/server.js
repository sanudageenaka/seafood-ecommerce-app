import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

// ✅ FIX FOR RAILWAY & CLOUD HOSTING
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})