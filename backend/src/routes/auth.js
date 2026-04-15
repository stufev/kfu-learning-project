const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
    const {fullName, email, password} = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {email}
    });

    if (existingUser) {
        return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword
        }
    });

    const token = jwt.sign(
        {userId: user.id},
        JWT_SECRET,
        {expiresIn: '1d'}
    );

    res.json({
        message: 'User created',
        token,
        userId: user.id
    });
});

// ЛОГИН
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({
        where: {email}
    });

    if (!user) {
        return res.status(400).json({message: 'User not found'});
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(400).json({message: 'Wrong password'});
    }

    const token = jwt.sign(
        {userId: user.id},
        JWT_SECRET,
        {expiresIn: '1d'}
    );

    res.json({token});
});

module.exports = router;