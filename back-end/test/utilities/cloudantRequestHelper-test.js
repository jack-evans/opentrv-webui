'use strict'

const cloudantRequestHelper = require('../../lib/utilities/cloudantRequestHelper.js')

describe('cloudantRequestHelper.js', () => {
  beforeEach(() => {
    // Reset the env variables
    process.env = {}
  })

  describe('createCloudantConnection', () => {
    describe('when the retryTimeout argument is not provided', () => {
      it('sets the retryTimeout to its default', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 1000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection()
        expect(cloudant.fakeCloudantObject.retryTimeout).toEqual(expectedOptions.retryTimeout)
      })
    })

    describe('when the retryTimeout argument is provided', () => {
      it('sets retryTimeout to what is provided', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000)
        expect(cloudant.fakeCloudantObject.retryTimeout).toEqual(expectedOptions.retryTimeout)
      })
    })

    describe('when the retryAttempts argument is not provided', () => {
      it('sets retryAttempts to default', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 3,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000)
        expect(cloudant.fakeCloudantObject.retryAttempts).toEqual(expectedOptions.retryAttempts)
      })
    })

    describe('when the retryAttempts argument is provided', () => {
      it('sets retryAttempts to what is provided', () => {
        process.env = {
          CDB_USER: 'admin',
          CDB_PASS: 'pass'
        }

        const expectedOptions = {
          account: process.env.CDB_USER,
          password: process.env.CDB_PASS,
          plugin: 'retry',
          retryAttempts: 10,
          retryTimeout: 3000
        }

        const cloudant = cloudantRequestHelper.createCloudantConnection(3000, 10)
        expect(cloudant.fakeCloudantObject.retryAttempts).toEqual(expectedOptions.retryAttempts)
      })
    })

    describe('when CDB_USER is not provided', () => {
      it('throws an error', () => {
        expect(() => {
          cloudantRequestHelper.createCloudantConnection()
        }).toThrow('Cloudant DB user (CDB_USER) not set in the Environment variables!')
      })
    })

    describe('when CDB_USER is not provided', () => {
      it('throws an error', () => {
        process.env.CDB_USER = 'admin'
        expect(() => {
          cloudantRequestHelper.createCloudantConnection()
        }).toThrow('Cloudant DB password (CDB_PASS) not set in the Environment variables!')
      })
    })
  })

  describe('createDatabase', () => {
    let fakeCloudantInstance
    const fakeDatabaseName = 'testdb'

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully creates a database in the cloudant instance', () => {
      beforeEach(() => {
        fakeCloudantInstance.db = {
          create: (databaseName, callback) => {
            callback()
          }
        }
      })

      it('returns a resolved promise with the database', () => {
        return expect(cloudantRequestHelper.createDatabase(fakeCloudantInstance, fakeDatabaseName)).resolves.toBe(undefined)
      })
    })

    describe('when it fails to create a database in the cloudant instance', () => {
      beforeEach(() => {
        fakeCloudantInstance.db = {
          create: (databaseName, callback) => {
            const error = new Error(`Bang when creating ${databaseName}`)
            callback(error)
          }
        }
      })

      describe('when the statusCode is 412', () => {
        it('returns a resolved promise', () => {
          fakeCloudantInstance.db = {
            create: (databaseName, callback) => {
              let error = {
                statusCode: 412
              }
              callback(error)
            }
          }

          return cloudantRequestHelper.createDatabase(fakeCloudantInstance, fakeDatabaseName)
            .then(result => {
              expect(result).toEqual({ok: true})
            })
        })
      })

      it('returns a rejected promise', () => {
        expect.assertions(1)
        return cloudantRequestHelper.createDatabase(fakeCloudantInstance, fakeDatabaseName)
          .catch(error => {
            expect(error.message).toEqual(`Bang when creating ${fakeDatabaseName}`)
          })
      })
    })
  })

  describe('useDatabase', () => {
    let fakeCloudantInstance
    const fakeDatabaseName = 'testdb'

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          return {
            name: databaseName,
            insert: () => {},
            get: () => {},
            list: () => {},
            destroy: () => {}
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    it('returns the database', () => {
      const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, fakeDatabaseName)
      expect(database).toHaveProperty('name')
      expect(database).toHaveProperty('insert')
      expect(database).toHaveProperty('get')
      expect(database).toHaveProperty('list')
      expect(database).toHaveProperty('destroy')
    })
  })

  describe('createIndex', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    let fakeDdoc = {
      name: 'first-name',
      type: 'json',
      index: {
        fields: ['name']
      }
    }

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              index: (document, callback) => {
                callback(null, document)
              }
            }
          }

          return {
            name: databaseName,
            index: (document, callback) => {
              const error = new Error('Bang in index document function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully creates a design document in the database', () => {
      it('returns a resolved promise with the document in the body', () => {
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        return cloudantRequestHelper.createIndex(database, goodDatabaseName, fakeDdoc)
          .then(document => {
            expect(document).toEqual(fakeDdoc)
          })
      })
    })

    describe('when it fails to create a design document in the database', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        return cloudantRequestHelper.createIndex(database, badDatabaseName, fakeDdoc)
          .catch(error => {
            expect(error.message).toEqual('Bang in index document function')
          })
      })
    })
  })

  describe('createDocument', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    let fakeDocument = {
      id: '1234',
      rev: '0.0.1',
      _id: '1234',
      _rev: '0.0.1',
      content: {
        nestedContent: 'some nested content'
      }
    }

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              insert: (document, callback) => {
                callback(null, document)
              }
            }
          }

          return {
            name: databaseName,
            insert: (document, callback) => {
              const error = new Error('Bang in insert document function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully creates a document in the database', () => {
      it('returns a resolved promise with the document in the body', () => {
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        return cloudantRequestHelper.createDocument(database, goodDatabaseName, fakeDocument)
          .then(document => {
            expect(document).toEqual(fakeDocument)
          })
      })
    })

    describe('when it fails to create a document in the database', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        return cloudantRequestHelper.createDocument(database, badDatabaseName, fakeDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang in insert document function')
          })
      })
    })
  })

  describe('retrieveDocument', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    let expectedDocument = {
      id: '1234',
      rev: '0.0.1',
      content: {
        nestedContent: 'some nested content'
      }
    }

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              get: (documentId, callback) => {
                const documentArray = [{
                  id: '4321',
                  rev: '0.0.1',
                  _id: '4321',
                  _rev: '0.0.1',
                  content: {
                    nestedContent: 'some nested content'
                  }
                }, {
                  id: '1234',
                  rev: '0.0.1',
                  _id: '1234',
                  _rev: '0.0.1',
                  content: {
                    nestedContent: 'some nested content'
                  }
                }]

                const document = documentArray.filter(document => {
                  return document._id === documentId
                })
                callback(null, document[0])
              }
            }
          }

          return {
            name: databaseName,
            get: (documentId, callback) => {
              const error = new Error('Bang in get document function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully retrieves a document from the database', () => {
      it('returns a resolved promise with the document in the body', () => {
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        return cloudantRequestHelper.retrieveDocument(database, goodDatabaseName, '1234')
          .then(document => {
            expect(document).toEqual(expectedDocument)
          })
      })
    })

    describe('when it fails to retrieve a document from the database', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        return cloudantRequestHelper.retrieveDocument(database, badDatabaseName, '1234')
          .catch(error => {
            expect(error.message).toEqual('Bang in get document function')
          })
      })
    })
  })

  describe('retrieveAllDocuments', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              list: (params, callback) => {
                const documentArray = {
                  rows: [{
                    id: '4321',
                    rev: '0.0.1',
                    _id: '4321',
                    _rev: '0.0.1',
                    content: {
                      nestedContent: 'some nested content'
                    }
                  }, {
                    id: '1234',
                    rev: '0.0.1',
                    _id: '1234',
                    _rev: '0.0.1',
                    content: {
                      nestedContent: 'some nested content'
                    }
                  }]
                }
                callback(null, documentArray)
              }
            }
          }

          return {
            name: databaseName,
            list: (params, callback) => {
              const error = new Error('Bang in list documents function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully retrieves all documents from the database', () => {
      it('returns a resolved promise with the array of documents in the body', () => {
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        return cloudantRequestHelper.retrieveAllDocuments(database, goodDatabaseName)
          .then(documents => {
            expect(documents).toHaveLength(2)
          })
      })
    })

    describe('when it fails to retrieve all documents from the database', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        return cloudantRequestHelper.retrieveAllDocuments(database, badDatabaseName)
          .catch(error => {
            expect(error.message).toEqual('Bang in list documents function')
          })
      })
    })
  })

  describe('updateDocument', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    let fakeDocument = {
      id: '1234',
      _id: '1234',
      content: {
        nestedContent: 'some nested content'
      }
    }

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              get: (id, callback) => {
                callback(null, {
                  id: '1234',
                  rev: '0.0.1',
                  _id: '1234',
                  _rev: '0.0.1',
                  content: {
                    nestedContent: 'random content'
                  }
                })
              },
              insert: (document, callback) => {
                callback(null, document)
              }
            }
          }

          return {
            name: databaseName,
            get: (id, callback) => {
              callback(null, {
                id: '1234',
                rev: '0.0.1',
                _id: '1234',
                _rev: '0.0.1',
                content: {
                  nestedContent: 'random content'
                }
              })
            },
            insert: (document, callback) => {
              const error = new Error('Bang in insert document function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully retrieves the document to be updated', () => {
      it('sets the _rev value in the new document', () => {
        const expectedDocument = {
          id: '1234',
          _id: '1234',
          _rev: '0.0.1',
          content: {
            nestedContent: 'some nested content'
          }
        }

        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        return cloudantRequestHelper.updateDocument(database, goodDatabaseName, fakeDocument)
          .then(document => {
            expect(document).toEqual(expectedDocument)
          })
      })

      it('continues and calls the insert function', () => {
        const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
        const spy = jest.spyOn(database, 'insert')

        return cloudantRequestHelper.updateDocument(database, goodDatabaseName, fakeDocument)
          .then(() => {
            expect(spy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when it successfully updates a document in the database', () => {
        it('returns a resolved promise with the document in the body', () => {
          const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
          return cloudantRequestHelper.updateDocument(database, goodDatabaseName, fakeDocument)
            .then(document => {
              expect(document).toEqual(fakeDocument)
            })
        })
      })

      describe('when it fails to update a document in the database', () => {
        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
          return cloudantRequestHelper.updateDocument(database, badDatabaseName, fakeDocument)
            .catch(error => {
              expect(error.message).toEqual('Bang in insert document function')
            })
        })
      })
    })

    describe('when it fails to retrieve the document to be updated', () => {
      let insertSpy
      let database

      beforeEach(() => {
        fakeCloudantInstance.db = {
          use: (databaseName) => {
            return {
              name: databaseName,
              get: (id, callback) => {
                const error = new Error('Bang in get document function')
                callback(error)
              },
              insert: () => {}
            }
          }
        }

        database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        insertSpy = jest.spyOn(database, 'insert')
      })

      afterEach(() => {
        insertSpy.mockReset()
        insertSpy.mockRestore()
      })

      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        return cloudantRequestHelper.updateDocument(database, badDatabaseName, fakeDocument)
          .catch(error => {
            expect(error.message).toEqual('Bang in get document function')
          })
      })

      it('does not call the insert function', () => {
        expect.assertions(1)
        return cloudantRequestHelper.updateDocument(database, badDatabaseName, fakeDocument)
          .catch(() => {
            expect(insertSpy).not.toHaveBeenCalled()
          })
      })
    })
  })

  describe('deleteDocument', () => {
    let fakeCloudantInstance
    const goodDatabaseName = 'gooddb'
    const badDatabaseName = 'baddb'

    beforeEach(() => {
      process.env = {
        CDB_USER: 'admin',
        CDB_PASS: 'pass'
      }

      fakeCloudantInstance = cloudantRequestHelper.createCloudantConnection()

      fakeCloudantInstance.db = {
        use: (databaseName) => {
          if (databaseName === 'gooddb') {
            return {
              name: databaseName,
              get: (id, callback) => {
                callback(null, {
                  id: '1234',
                  rev: '0.0.1',
                  _id: '1234',
                  _rev: '0.0.1',
                  content: {
                    nestedContent: 'random content'
                  }
                })
              },
              destroy: (documentId, rev, callback) => {
                callback(null, 'SUCCESS')
              }
            }
          }

          return {
            name: databaseName,
            get: (id, callback) => {
              callback(null, {
                id: '1234',
                rev: '0.0.1',
                _id: '1234',
                _rev: '0.0.1',
                content: {
                  nestedContent: 'random content'
                }
              })
            },
            destroy: (documentId, rev, callback) => {
              const error = new Error('Bang in destroy document function')
              callback(error)
            }
          }
        }
      }
    })

    afterEach(() => {
      process.env = {}
    })

    describe('when it successfully retrieves the document to be deleted', () => {
      describe('when it successfully deletes a document from the database', () => {
        it('returns a resolved promise', () => {
          const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, goodDatabaseName)
          return cloudantRequestHelper.deleteDocument(database, goodDatabaseName, '1234')
            .then(result => {
              expect(result).toEqual('SUCCESS')
            })
        })
      })

      describe('when it fails to delete a document from the database', () => {
        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          const database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
          return cloudantRequestHelper.deleteDocument(database, badDatabaseName, '1234')
            .catch(error => {
              expect(error.message).toEqual('Bang in destroy document function')
            })
        })
      })
    })

    describe('when it fails to retrieve the document to be deleted', () => {
      let deleteSpy
      let database

      beforeEach(() => {
        fakeCloudantInstance.db = {
          use: (databaseName) => {
            return {
              name: databaseName,
              get: (id, callback) => {
                const error = new Error('Bang in get document function')
                callback(error)
              },
              delete: () => {}
            }
          }
        }

        database = cloudantRequestHelper.useDatabase(fakeCloudantInstance, badDatabaseName)
        deleteSpy = jest.spyOn(database, 'delete')
      })

      afterEach(() => {
        deleteSpy.mockReset()
        deleteSpy.mockRestore()
      })

      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        return cloudantRequestHelper.deleteDocument(database, badDatabaseName, '1234')
          .catch(error => {
            expect(error.message).toEqual('Bang in get document function')
          })
      })

      it('does not call the delete function', () => {
        expect.assertions(1)
        return cloudantRequestHelper.deleteDocument(database, badDatabaseName, '1234')
          .catch(() => {
            expect(deleteSpy).not.toHaveBeenCalled()
          })
      })
    })
  })
})
