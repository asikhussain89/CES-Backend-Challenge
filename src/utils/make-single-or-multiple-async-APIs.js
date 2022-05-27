const axiosObject = require('../config/axios-config')

module.exports = {
  makeMultipleAsyncAPIs: async function(apiUrlsArray, httpMethodsArray) {
    try {
      let axiosHttpMethodArray = apiUrlsArray.map((url, index) => {
        return axiosObject[httpMethodsArray[index].toLowerCase()](url)
      })
      const response = await Promise.all(axiosHttpMethodArray)
      const data = response.map((response) => response.data)
      return data.flat()
    } catch (error) {
      return [
        {
          status: 'error',
          message: error.message,
        },
      ]
    }
  },
  makeSingleAsyncAPIs: async function(apiUrl, httpMethod) {
    try {
      const response = await axiosObject[httpMethod.toLowerCase()](apiUrl)
      return response
    } catch (error) {
      return [
        {
          status: 'error',
          message: error.message,
        },
      ]
    }
  },
}
