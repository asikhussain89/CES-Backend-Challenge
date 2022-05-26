const axiosObject = require('../config/axios-config')

module.exports = {
    makeMultipleAsyncAPIs: async function (apiUrlsArray, httpMethodsArray) {
        let axiosHttpMethodArray = apiUrlsArray.map( (url, index) => {
            return axiosObject[httpMethodsArray[index].toLowerCase()](url)
        })
        const response = await Promise.all(axiosHttpMethodArray)
        const data = response.map((response) => response.data)
        return data.flat()
    },
    makeSingleAsyncAPIs: async function (apiUrl, httpMethod) {
        const response = await axiosObject[httpMethod.toLowerCase()](apiUrl)
        return response
    }
}