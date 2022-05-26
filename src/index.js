const chalk = require('chalk')
const commonConfig = require('./config/common-config')
const contributorsCommentsListOfRepositoryFunc = require('./model/contributers-comments-list-of-repository')

// console.log(chalk.yellow('Your github token is:'))
// console.info(chalk.yellow(commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN))

if (commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === '<TOKEN>' || commonConfig.GITHUB_PERSONAL_ACCESS_TOKEN === '') {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(chalk.red('Missing Token : Add the Github Personal Access Token in the config/common_config.js file'))
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
} else {
    if (typeof process.argv[2] !== 'undefined' && typeof process.argv[3] !== 'undefined') {
        if (process.argv[2] === "--repo") {
            let inputNoOfDaysForFilterComments = 
                (typeof process.argv[4] !== 'undefined' &&
                    typeof process.argv[5] !== 'undefined') ? 
                    process.argv[5].slice(0, process.argv[5].length - 1) : 0
            contributorsCommentsListOfRepositoryFunc(process.argv[3], inputNoOfDaysForFilterComments)
        } // Add Else if block for process any other parameters ( instead of --repo ) in future
    } else {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        console.log(chalk.red('Missing input : Run the app with proper inputs'))
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    }
}
