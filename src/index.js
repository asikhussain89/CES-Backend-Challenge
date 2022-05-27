const commonConsoleMessageLayout = require('../src/utils/common-console-message-layout')
const commonConfig = require('./config/common-config')
const contributorsCommentsListOfRepositoryFunc = require('./model/contributers-comments-list-of-repository')

if (
  commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === '<TOKEN>' ||
  commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === ''
) {
  commonConsoleMessageLayout(
    `Missing Token : Add the Github Personal Access Token in the config/common-config.js file`,
    'red',
  )
} else if (
  typeof process.argv[2] !== 'undefined' &&
  typeof process.argv[3] !== 'undefined'
) {
  if (process.argv[2] === '--repo') {
    let inputNoOfDaysForFilterComments = 0
    let inputPaginationCount = 30
    process.argv.forEach((argument, argvIndex) => {
      if (argvIndex > 1) {
        if (
          typeof process.argv[argvIndex] !== 'undefined' &&
          process.argv[argvIndex] === '--period'
        ) {
          inputNoOfDaysForFilterComments =
            typeof process.argv[argvIndex + 1] !== 'undefined'
              ? process.argv[argvIndex + 1].slice(0, process.argv[5].length - 1)
              : inputNoOfDaysForFilterComments
        }
        if (
          typeof process.argv[argvIndex] !== 'undefined' &&
          process.argv[argvIndex] === '--per_page'
        ) {
          inputPaginationCount =
            typeof process.argv[argvIndex + 1] !== 'undefined'
              ? process.argv[argvIndex + 1]
              : inputPaginationCount
        }
      }
    })
    if (inputPaginationCount > 0 && inputPaginationCount <= 100) {
      contributorsCommentsListOfRepositoryFunc(
        process.argv[3],
        inputNoOfDaysForFilterComments,
        inputPaginationCount,
      )
    } else {
      commonConsoleMessageLayout(
        'Maximum Pagination Count : The --per_page parameter value should be 1 to 100',
        'red',
      )
    }
  } // Add Else if block for process any other parameters ( instead of --repo ) in future
} else {
  commonConsoleMessageLayout(
    'Missing input : Run the app with proper inputs',
    'red',
  )
}
