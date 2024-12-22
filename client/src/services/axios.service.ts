import axios from 'axios'
import { store } from '../redux/store'

const BASE_URL = 'http://127.0.0.1:5000'

axios.defaults.withCredentials = false

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json', // עדכון ל-JSON
    Accept: 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.user?.token

    if (token) {
      config.headers.Authorization = `Token ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  }
)

export const get = async (url: string, params = {}) => {
  return instance.get(url, { params })
}

export const post = async (url: string, data: any) => {
  return instance.post(url, data)
}

export const put = async (url: string, data: any) => {
  return instance.put(url, data)
}

export const remove = async (url: string) => {
  return instance.delete(url)
}

export const patch = async (url: string, data: any) => {
  return instance.patch(url, data)
}

export default instance
