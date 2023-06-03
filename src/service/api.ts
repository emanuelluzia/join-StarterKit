import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const api = axios.create({
  baseURL: 'http://localhost:8989/api'
})

export default api
