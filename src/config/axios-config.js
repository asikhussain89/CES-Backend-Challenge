const axios = require('axios')
const commonConfig = require('../config/common-config')

module.exports = axios.create({
  baseURL: commonConfig.GITHUB_API_BASE_DOMAIN,
  headers: {
    Authorization: `token ${commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})
