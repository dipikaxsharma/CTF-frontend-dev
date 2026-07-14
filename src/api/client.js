import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: {
    Authorization: `Token ${import.meta.env.VITE_API_TOKEN}`,
  },
})

export default api
