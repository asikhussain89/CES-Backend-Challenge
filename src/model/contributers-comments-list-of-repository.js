const commonConsoleMessageLayout = require('../utils/common-console-message-layout')
const leftPad = require('left-pad')
const makeAsyncAPIConfig = require('../utils/make-single-or-multiple-async-APIs')
const checkGithubRateLimit = require('../utils/check-github-rate-limit-API')

/**
 *
 * Export the below function to get the GitHub contributors Comments with Commit details
 * Function receive first param as repository name
 * Function receive second optional param as number of days which consider as started date from current date
 * If second parameter not received, function will return all data
 */
module.exports = async function(
  repositoryName,
  noOfDaysForFilterComments,
  paginationPerPageCount,
) {
  let isGithubRateLimitReached = await checkGithubRateLimit()
  if (!isGithubRateLimitReached) {
    return
  }
  const contributorsCommentsListAPIUrlArray = []
  if (paginationPerPageCount !== 30) {
    contributorsCommentsListAPIUrlArray.push(
      `/repos/${repositoryName}/commits?per_page=${paginationPerPageCount}`,
    )
    contributorsCommentsListAPIUrlArray.push(
      `/repos/${repositoryName}/issues/comments?per_page=${paginationPerPageCount}`,
    )
    contributorsCommentsListAPIUrlArray.push(
      `/repos/${repositoryName}/pulls/comments?per_page=${paginationPerPageCount}`,
    )
  } else {
    contributorsCommentsListAPIUrlArray.push(`/repos/${repositoryName}/commits`)
    contributorsCommentsListAPIUrlArray.push(
      `/repos/${repositoryName}/issues/comments`,
    )
    contributorsCommentsListAPIUrlArray.push(
      `/repos/${repositoryName}/pulls/comments`,
    )
  }
  const contributorsCommentsListAPIHttpMethodArray = ['GET', 'GET', 'GET']
  let contributorsCommitsListAPIUrl = `/repos/${repositoryName}/stats/contributors`
  let contributorsCommitsListAPIHttpMethod = 'GET'
  contributorsCommentsListAPIUrlArray.push(contributorsCommitsListAPIUrl)
  contributorsCommentsListAPIHttpMethodArray.push(
    contributorsCommitsListAPIHttpMethod,
  )
  const contributorsCommentsAndCommitListArray =
    await makeAsyncAPIConfig.makeMultipleAsyncAPIs(
      contributorsCommentsListAPIUrlArray,
      contributorsCommentsListAPIHttpMethodArray,
    )
  const contributorsCommentsAndCommitListObject = []
  const contributorsIdListArray = []
  let leftPadCount = 1
  contributorsCommentsAndCommitListArray.forEach((data) => {
    if (typeof data.status !== 'undefined' && data.status === 'error') {
      commonConsoleMessageLayout(`Error : ${data.message}`, 'red')
    }
    if (
      typeof data.author !== 'undefined' &&
      typeof data.author.id !== 'undefined' &&
      typeof data.commit !== 'undefined' &&
      typeof data.commit.author !== 'undefined' &&
      typeof data.commit.author.name !== 'undefined' &&
      typeof data.commit.author.date !== 'undefined'
    ) {
      if (
        noOfDaysForFilterComments === 0 ||
        new Date(data.commit.author.date).getTime() >
          new Date().setDate(new Date().getDate() - noOfDaysForFilterComments)
      ) {
        if (contributorsIdListArray.indexOf(data.author.id) !== -1) {
          contributorsCommentsAndCommitListObject[
            contributorsIdListArray.indexOf(data.author.id)
          ][data.author.id].commentCount += 1
          if (
            contributorsCommentsAndCommitListObject[
              contributorsIdListArray.indexOf(data.author.id)
            ][data.author.id].commentCount.toString().length > leftPadCount
          ) {
            leftPadCount += 1
          }
        } else {
          contributorsCommentsAndCommitListObject.push({
            [data.author.id]: {
              name: data.commit.author.name,
              commentCount: 1,
              commitCount: 0,
            },
          })
          contributorsIdListArray.push(data.author.id)
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
        noOfDaysForFilterComments === 0 ||
        new Date(data.created_at).getTime() >
          new Date().setDate(new Date().getDate() - noOfDaysForFilterComments)
      ) {
        if (contributorsIdListArray.indexOf(data.user.id) !== -1) {
          contributorsCommentsAndCommitListObject[
            contributorsIdListArray.indexOf(data.user.id)
          ][data.user.id].commentCount += 1
          if (
            contributorsCommentsAndCommitListObject[
              contributorsIdListArray.indexOf(data.user.id)
            ][data.user.id].commentCount.toString().length > leftPadCount
          ) {
            leftPadCount += 1
          }
        } else {
          contributorsCommentsAndCommitListObject.push({
            [data.user.id]: {
              name: data.user.login,
              commentCount: 1,
              commitCount: 0,
            },
          })
          contributorsIdListArray.push(data.user.id)
        }
      }
    }

    if (
      typeof data.total !== 'undefined' &&
      typeof data.author.id !== 'undefined' &&
      typeof data.author.login !== 'undefined'
    ) {
      if (contributorsIdListArray.indexOf(data.author.id) !== -1) {
        contributorsCommentsAndCommitListObject[
          contributorsIdListArray.indexOf(data.author.id)
        ][data.author.id].commitCount += 1
        if (
          contributorsCommentsAndCommitListObject[
            contributorsIdListArray.indexOf(data.author.id)
          ][data.author.id].commitCount.toString().length > leftPadCount
        ) {
          leftPadCount += 1
        }
      } else {
        contributorsCommentsAndCommitListObject.push({
          [data.author.id]: {
            name: data.author.login,
            commentCount: 0,
            commitCount: 1,
          },
        })
        contributorsIdListArray.push(data.author.id)
      }
    }
  })
  contributorsIdListArray.forEach((value, index) => {
    console.log(
      `${leftPad(
        contributorsCommentsAndCommitListObject[index][value].commentCount,
        leftPadCount,
      )} comments, ${
        contributorsCommentsAndCommitListObject[index][value].name
      } (${
        contributorsCommentsAndCommitListObject[index][value].commitCount
      } commits)`,
    )
  })
}
