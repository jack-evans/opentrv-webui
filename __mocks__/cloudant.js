'use strict'

let Cloudant = jest.genMockFromModule('cloudant')

/**
 * mock for cloudant
 * @param {Object} options - the configuration to pass to the Cloudant instance
 * @returns {{fakeCloudantObject: *}}
 */
function cloudant (options) {
  return {
    fakeCloudantObject: options
  }
}

Cloudant = cloudant
module.exports = Cloudant
