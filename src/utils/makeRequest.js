
export default function makeRequest (url, options) {
  return global.fetch(url, options)
    .then(internal.checkStatus)
    .then(internal.parseJSON)
}

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

export const internal = {
  checkStatus: checkStatus,
  parseJSON: parseJSON
}
