import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import profileRoutes from './routes/profile.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Info', 'Apikey']
}))

app.use(express.json())

app.use('/api/profile', profileRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`👤 Profile API: http://localhost:${PORT}/api/profile/fetch-by-username`)
})
