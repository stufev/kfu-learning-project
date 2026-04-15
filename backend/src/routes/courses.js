const express = require('express')
const prisma = require('../prisma')

const router = express.Router()

// Получить все курсы (с фильтрацией)
router.get('/', async (req, res) => {
    const {search, format} = req.query

    const formatMap = {
        online: 'онлайн',
        offline: 'очно'
    }

    const filters = []

    if (search) {
        filters.push({
            title: {
                contains: search
            }
        })
    }

    const formatValue = formatMap[format]

    if (formatValue) {
        filters.push({
            format: formatValue
        })
    }

    const courses = await prisma.course.findMany({
        where: filters.length ? {AND: filters} : {}
    })

    res.json(courses)
})


// Получить курс по ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)

    const course = await prisma.course.findUnique({
        where: {id}
    })

    if (!course) {
        return res.status(404).json({message: 'Course not found'})
    }

    res.json(course)
})

module.exports = router