import axios from 'axios'
import { store } from '../redux/store'

export const BASE_URL = 'http://127.0.0.1:5000'

axios.defaults.withCredentials = false

// Creates axios instance with base configuration and interceptors for authentication
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
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

// HTTP GET request wrapper with automatic authentication headers
export const get = async (url: string, params = {}) => {
  return instance.get(url, { params })
}

// HTTP POST request wrapper with automatic authentication headers
export const post = async (url: string, data: any) => {
  return instance.post(url, data)
}

// HTTP PUT request wrapper with automatic authentication headers
export const put = async (url: string, data: any) => {
  return instance.put(url, data)
}

// HTTP DELETE request wrapper with automatic authentication headers
export const remove = async (url: string) => {
  return instance.delete(url)
}

// HTTP PATCH request wrapper with automatic authentication headers
export const patch = async (url: string, data: any) => {
  return instance.patch(url, data)
}

export default instance
