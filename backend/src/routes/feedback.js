const express = require('express')
const prisma = require('../prisma')

const router = express.Router()

// создать сообщение
router.post('/', async (req, res) => {
    const { name, email, message } = req.body

    await prisma.feedback.create({
        data: {
            name,
            email,
            message
        }
    })

    res.json({ message: 'Sent' })
})

module.exports = router