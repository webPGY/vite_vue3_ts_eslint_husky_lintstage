import axios from './axios'

const login = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/usermanager/login', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const logout = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/usermanager/logout', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

export default {
  login,
  logout
}
