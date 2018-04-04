
export default function makeRequest (apiPath, options) {
  options.mode = 'cors'
  if (options.headers) {
    options.headers['Content-Type'] = 'application/json'
  } else {
    options.headers = {
      'Content-Type': 'application/json'
    }
  }

  return global.fetch(`http://localhost:3001${apiPath}`, options)
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
