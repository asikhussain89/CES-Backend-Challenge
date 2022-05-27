const commonConsoleMessageLayout = require('../utils/common-console-message-layout')
const makeAsyncAPIConfig = require('./make-single-or-multiple-async-APIs')

module.exports = async function() {
    const githubRateLimitData = await makeAsyncAPIConfig.makeSingleAsyncAPIs('/rate_limit', 'GET')
    if (
        typeof githubRateLimitData[0] !== 'undefined' &&
        typeof githubRateLimitData[0].status !== 'undefined' &&
        githubRateLimitData[0].status === 'error'
    ) {
        commonConsoleMessageLayout(`Error : ${githubRateLimitData[0].message}`, 'red')
        return false
    } else if (
        typeof githubRateLimitData.data !== 'undefined' &&
        typeof githubRateLimitData.data.rate !== 'undefined' &&
        typeof githubRateLimitData.data.rate.remaining !== 'undefined'
    ) {
        if (githubRateLimitData.data.rate.remaining == 0) {
            commonConsoleMessageLayout(`Rate Limit Crossed : You had already cross the Github API's rate limit`, 'red')
            return false
        } else {
            commonConsoleMessageLayout(`Rate Limit Remaining : You have ${githubRateLimitData.data.rate.remaining} remaining Github API's rate limit`, 'green')
            return true
        }
    }
}