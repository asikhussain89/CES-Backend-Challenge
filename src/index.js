const commonConsoleMessageLayout = require('../src/utils/common-console-message-layout')
const commonConfig = require('./config/common-config')
const contributorsCommentsListModel = require('./model/contributers-comments-list-of-repository')

if (
  commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === '<TOKEN>' ||
  commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === ''
) {
  commonConsoleMessageLayout(
    'Missing Token : Add the Github Personal Access Token in the config/common-config.js file',
    'red',
  )
} else if (
  typeof process.argv[2] !== 'undefined' &&
  typeof process.argv[3] !== 'undefined'
) {
  if (process.argv[2] === '--repo') {
    let inputNoOfDaysForFilterComments = 0
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
        } // Add additional if block for process any other input like --period in future
      }
    })
    contributorsCommentsListModel(
      process.argv[3],
      inputNoOfDaysForFilterComments,
    )
  } // Add Else if block for process any other parameters ( instead of --repo ) in future
} else {
  commonConsoleMessageLayout(
    'Missing input : Run the app with proper inputs',
    'red',
  )
}
