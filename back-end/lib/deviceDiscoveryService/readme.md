# DeviceDiscoveryService

## Background

This readme details the API for the deviceDiscoveryService.

The deviceDiscoveryService is responsible for locating the devices for the user, storing the basic information of the devices in IBM Cloudant, and returning the data to the user so they can view and edit some of the information.


## API

### POST /devices

Creates a new device in the cloudant database

Responses:
- 200, device object
- 400, bad request
- 409, conflict
- 500, internal server error

### GET /devices

Interrogates the OpenTRV server to gather the devices that are registered to the server

Responses:
- 200, array of device objects
- 400, bad request
- 404, no devices found
- 500, internal server error

### GET /devices/:id

Interrogates the OpenTRV server to get a specific device registered on it

Responses:
- 200, device object
- 400, bad request
- 404, no device found
- 500, internal server error

### PUT /devices/:id

Updates the basic information of a specific OpenTRV unit in the IBM Cloudant database

Responses:
- 200, the updated information of the device object
- 400, bad request
- 409, conflict
- 500, internal server error

### DELETE /devices/:id

Deletes an OpenTRV unit from the IBM Cloudant database.
__Should it delete it from the OpenTRV server as well?__  
 
Responses:
- 204
- 400, bad request
- 404, no device found
- 500, internal server error
