import axios from './axios'

const meetingAdd = (data) =>
  new Promise((resolve, reject) => {
    axios
      .post('/meeting/add', data)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingModify = (data, meetingId) =>
  new Promise((resolve, reject) => {
    axios
      .post(`/meeting/modify?meetingId=${meetingId}`, data)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingCancel = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/cancel', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingFurture = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/furture', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingHistory = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/history', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingQuery = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/query', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingJoin = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/join', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

const meetingExit = (data) =>
  new Promise((resolve, reject) => {
    axios
      .get('/meeting/exit', { params: data })
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      })
  })

export default {
  meetingAdd,
  meetingModify,
  meetingCancel,
  meetingFurture,
  meetingHistory,
  meetingQuery,
  meetingJoin,
  meetingExit
}
