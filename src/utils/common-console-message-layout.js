const chalk = require('chalk')

module.exports = function(messageText, messageColor) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(chalk[messageColor](messageText))
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
}