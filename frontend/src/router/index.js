import {createRouter, createWebHistory} from 'vue-router'
import Courses from '../pages/Courses.vue';
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import MyCourses from "@/pages/MyCourses.vue";
import Course from "@/pages/Course.vue";
import Profile from "@/pages/Profile.vue";
import Feedback from "@/pages/Feedback.vue";

const routes = [
    {path: '/', component: Courses},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/my', component: MyCourses, meta: {requiresAuth: true}},
    {path: '/course/:id', component: Course},
    {path: '/profile', component: Profile, meta: {requiresAuth: true}},
    {path: '/feedback', component: Feedback},
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router
