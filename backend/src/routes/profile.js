const express = require('express')
const prisma = require('../prisma')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.userId},
        select: {
            id: true,
            fullName: true,
            email: true
        },
    })

    res.json(user)
})

const { Prisma } = require('@prisma/client')

router.put('/', auth, async (req, res) => {
    const { fullName, email } = req.body

    try {
        const updated = await prisma.user.update({
            where: { id: req.userId },
            data: { fullName, email },
            select: {
                id: true,
                fullName: true,
                email: true
            },
        })

        res.json(updated)

    } catch (e) {
        // Prisma unique constraint violation
        if (e.code === 'P2002') {
            return res.status(400).json({
                message: 'Unable to update profile'
            })
        }

        return res.status(500).json({
            message: 'Server error'
        })
    }
})
module.exports = router