import api, { type RequestData } from './fetch'

function request(data: RequestData) {
  return api.request(data)
}

export default request
