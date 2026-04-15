const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// routes
const authRoutes = require('./routes/auth')
const enrollmentRoutes = require('./routes/enrollments')
const courseRoutes = require('./routes/courses')
const profileRoutes = require('./routes/profile')
const feedbackRoutes = require('./routes/feedback')

app.use('/auth', authRoutes)
app.use('/enrollments', enrollmentRoutes)
app.use('/courses', courseRoutes)
app.use('/profile', profileRoutes)
app.use('/feedback', feedbackRoutes)

// healthcheck
app.get('/', (req, res) => {
    res.send('API работает')
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})