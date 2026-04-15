const express = require('express');
const prisma = require('../prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// записаться на курс
router.post('/', auth, async (req, res) => {
    const userId = req.userId;
    const {courseId} = req.body;

    const existing = await prisma.enrollment.findFirst({
        where: {
            userId,
            courseId
        }
    });

    if (existing) {
        return res.status(400).json({message: 'Already enrolled'});
    }

    const enrollment = await prisma.enrollment.create({
        data: {
            userId,
            courseId,
            status: 'enrolled'
        }
    });

    res.json(enrollment);
});

// мои курсы
router.get('/my', auth, async (req, res) => {
    const userId = req.userId;

    const courses = await prisma.enrollment.findMany({
        where: {userId},
        include: {course: true}
    });

    res.json(courses);
});

router.put('/:id/status', auth, async (req, res) => {
    const {status} = req.body
    const id = Number(req.params.id)

    const updated = await prisma.enrollment.update({
        where: {id},
        data: {status}
    })

    res.json(updated)
})

module.exports = router;