const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.course.createMany({
        data: [
            {
                title: 'Методика преподавания математики',
                description: 'Курс повышения квалификации для учителей математики.',
                duration: '72 часа',
                format: 'очно'
            },
            {
                title: 'Цифровые технологии в образовании',
                description: 'Использование цифровых инструментов в учебном процессе.',
                duration: '36 часов',
                format: 'онлайн'
            },
            {
                title: 'Психология обучения',
                description: 'Основы педагогической психологии и взаимодействия с учениками.',
                duration: '48 часов',
                format: 'очно'
            }
        ]
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });