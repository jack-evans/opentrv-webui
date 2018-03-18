import * as makeRequest from './makeRequest'

describe('makeRequest.js', () => {
  const fakeUrl = 'http://localhost:3002'
  let fetchSpy

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch')
  })

  afterEach(() => {
    fetchSpy.mockReset()
  })

  describe('default exported function', () => {
    it('calls the checkStatus function', () => {
      fetchSpy.mockReturnValue(Promise.resolve())
      const checkStatusSpy = jest.spyOn(makeRequest.internal, 'checkStatus').mockReturnValue(Promise.resolve())
      const parseJSONSpy = jest.spyOn(makeRequest.internal, 'parseJSON').mockReturnValue(Promise.resolve())

      return makeRequest.default(fakeUrl + '/examplePath', {method: 'POST'})
        .then(() => {
          expect(checkStatusSpy).toHaveBeenCalledTimes(1)
          checkStatusSpy.mockRestore()
          parseJSONSpy.mockRestore()
        })
    })

    it('calls the parseJSON function', () => {
      fetchSpy.mockReturnValue(Promise.resolve())
      const checkStatusSpy = jest.spyOn(makeRequest.internal, 'checkStatus').mockReturnValue(Promise.resolve())
      const parseJSONSpy = jest.spyOn(makeRequest.internal, 'parseJSON').mockReturnValue(Promise.resolve())

      return makeRequest.default(fakeUrl + '/examplePath', {method: 'POST'})
        .then(() => {
          expect(parseJSONSpy).toHaveBeenCalledTimes(1)
          checkStatusSpy.mockRestore()
          parseJSONSpy.mockRestore()
        })
    })
  })

  describe('internal functions', () => {
    describe('checkStatus', () => {
      describe('when the response status is between 200 and 300', () => {
        it('returns the response', () => {
          const response = {
            status: 201,
            statusText: 'OK',
            body: {
              somecontent: 'content'
            }
          }

          expect(makeRequest.internal.checkStatus(response)).toEqual(response)
        })
      })

      describe('when the response is not between 200 and 300', () => {
        it('throws an error', () => {
          const response = {
            status: 500,
            statusText: 'Internal server error'
          }

          expect(() => {
            makeRequest.internal.checkStatus(response)
          }).toThrowErrorMatchingSnapshot()
        })
      })
    })

    describe('parseJSON', () => {
      it('calls the json method within the response', () => {
        const response = {
          status: 200,
          statusText: 'OK',
          json: () => {}
        }

        const jsonSpy = jest.spyOn(response, 'json')

        makeRequest.internal.parseJSON(response)
        expect(jsonSpy).toHaveBeenCalledTimes(1)
        jsonSpy.mockReset()
      })
    })
  })
})
