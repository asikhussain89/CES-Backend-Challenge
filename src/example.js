const apiBase = 'https://api.github.com'

const axios = require('axios')
const config = require('./config')
const chalk = require('chalk')
const leftPad = require('left-pad')

const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

async function printCurrentUserDetails() {
  let repoUrl = config.GITHUB_OWNER_NAME + '/' + config.GITHUB_REPO_NAME
  let periodDays = 0
  if (typeof process.argv[3] !== 'undefined') {
    repoUrl = process.argv[3]
  }
  if (typeof process.argv[5] !== 'undefined') {
    periodDays = process.argv[5].slice(0, process.argv[5].length - 1)
  }
  try {
    const res = await Promise.all([
      http.get(`/repos/${repoUrl}/commits`),
      http.get(`/repos/${repoUrl}/issues/comments`),
      http.get(`/repos/${repoUrl}/pulls/comments`),
      http.get(`/repos/${repoUrl}/stats/contributors`),
    ])
    const data = res.map((res) => res.data)
    const contributorsObj = []
    const contributorsIdArr = []
    let leftPadCount = 1
    data.flat().forEach((data) => {
      if (
        typeof data.author !== 'undefined' &&
        typeof data.author.id !== 'undefined' &&
        typeof data.commit !== 'undefined' &&
        typeof data.commit.author !== 'undefined' &&
        typeof data.commit.author.name !== 'undefined' &&
        typeof data.commit.author.date !== 'undefined'
      ) {
        if (
          periodDays === 0 ||
          new Date(data.commit.author.date).getTime() >
            new Date().setDate(new Date().getDate() - periodDays)
        ) {
          if (contributorsIdArr.indexOf(data.author.id) !== -1) {
            contributorsObj[contributorsIdArr.indexOf(data.author.id)][
              data.author.id
            ].commentCount += 1
            if (
              contributorsObj[contributorsIdArr.indexOf(data.author.id)][
                data.author.id
              ].commentCount.toString().length > leftPadCount
            ) {
              leftPadCount += 1
            }
          } else {
            contributorsObj.push({
              [data.author.id]: {
                name: data.commit.author.name,
                commentCount: 1,
                commitCount: 0,
              },
            })
            contributorsIdArr.push(data.author.id)
          }
        }
      }

      if (
        typeof data.user !== 'undefined' &&
        typeof data.user.id !== 'undefined' &&
        typeof data.user.login !== 'undefined' &&
        typeof data.created_at !== 'undefined'
      ) {
        if (
          periodDays === 0 ||
          new Date(data.created_at).getTime() >
            new Date().setDate(new Date().getDate() - periodDays)
        ) {
          if (contributorsIdArr.indexOf(data.user.id) !== -1) {
            contributorsObj[contributorsIdArr.indexOf(data.user.id)][
              data.user.id
            ].commentCount += 1
            if (
              contributorsObj[contributorsIdArr.indexOf(data.user.id)][
                data.user.id
              ].commentCount.toString().length > leftPadCount
            ) {
              leftPadCount += 1
            }
          } else {
            contributorsObj.push({
              [data.user.id]: {
                name: data.user.login,
                commentCount: 1,
                commitCount: 0,
              },
            })
            contributorsIdArr.push(data.user.id)
          }
        }
      }

      if (
        typeof data.total !== 'undefined' &&
        typeof data.author.id !== 'undefined' &&
        typeof data.author.login !== 'undefined'
      ) {
        if (contributorsIdArr.indexOf(data.author.id) !== -1) {
          contributorsObj[contributorsIdArr.indexOf(data.author.id)][
            data.author.id
          ].commitCount += 1
          if (
            contributorsObj[contributorsIdArr.indexOf(data.author.id)][
              data.author.id
            ].commitCount.toString().length > leftPadCount
          ) {
            leftPadCount += 1
          }
        } else {
          contributorsObj.push({
            [data.author.id]: {
              name: data.author.login,
              commentCount: 0,
              commitCount: 1,
            },
          })
          contributorsIdArr.push(data.author.id)
        }
      }
    })
    contributorsIdArr.forEach((val, index) => {
      console.log(`${leftPad(
        contributorsObj[index][val].commentCount,
        leftPadCount,
      )}
        comments, ${contributorsObj[index][val].name} 
        (${contributorsObj[index][val].commitCount} commits)`)
    })
  } catch (err) {
    console.error(chalk.red(err))
    console.dir(err.response.data, { colors: true, depth: 4 })
  }
}

printCurrentUserDetails()
