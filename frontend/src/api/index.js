import axios from 'axios'
import { useAuthStore } from '../store/auth'

const api = axios.create({
    baseURL: 'http://localhost:3000'
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    const token = auth.token

    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api