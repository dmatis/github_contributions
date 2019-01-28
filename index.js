// TODO:
// Write a function() for generic web request
// Write a function() for each request type
// Write a function() for combining all the contribution types

// All API calls needed:
// GET repos
// 

// Function for getting contribution for one day
// For-loop for getting contribution on every day

// Definition of contribution:
// https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/


// Issues
// Relies on needing repositories
// GET /user/issues
// Sort by date created / updated?

// Repositories
// GET /user/repos
// Create


// Pull requests:
// Need to first get all repos
// Then get pull requests for those repos
// Then return those that have been updated that day
// Only counts if: owner of PR, created, updated, merged, closed


// Commits
var Promise= require('promise');

// Set this up as an input to the server
var user = 'amilner42';
var userInfo = {};
var repos = [];
var token = 'd0842c628bb93efa5cc576633e9034f90b637580';
// var user = 'dmatis';
var baseUrl = `https://api.github.com/users/${user}`
var contributionArray = new Array(365).fill(0);

// Get today's date and compute the formatted dates for a year
function computeDateArray() {
  var now = new Date();
  var dateArray = []

  for (var i = 0; i < 365; i++) {
    var pastDate = new Date();
    pastDate.setDate(now.getDate() + i - 365)
    dateArray[i] = pastDate.toISOString().slice(0, 10);
  }
  return dateArray
}

function getPullRequestContributions(date) {
  url = `https://api.github.com/repos/${user}/${repo}/pulls`
}

// Includes the following repository activity that match for a given date:
// Created
// Updated
// Pushed
// function getRepositoryData(date, requestUrl) {
//   // Get repos
//   const request = require('request');
//   const options = {
//     url: requestUrl,
//     headers: {
//       'User-Agent': 'dmatis'
//     }
//   };
//   request(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       const fs = require('fs');
//       const res = JSON.parse(body);
//       console.log(res)
//       fs.write('output.txt', res);
//       // for each repo in response, inspect created_at, updated_at, pushed_at
//       // if it matches the 'date' keep it in an array
//       // for (var i = 0; i < res.length; i++) {
//       //   console.log(res[i].created_at);
//       //   var regex_date = new RegExp(date, 'g');
//       //   if (res[i].created_at.match(regex_date)) {
//       //     console.log(res[i].created_at);
//       //   }
//       // }
//     }
//   })
// };


// Not needed yet
function getUserInfo(callback) {
  const request = require('request');
  const options = {
    url: `https://api.github.com/users/${user}`,
    headers: {
      'User-Agent': `${user}`,
      'Authorization': `token ${token}`
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // const fs = require('fs');
      callback(JSON.parse(body));
      // fs.writeFileSync('user.json', body);
    }
    else {
      return console.error('Failed to get User Info:', error);
    }
  });
}

function getRepositoryCommits(repo) {
  return new Promise((resolve, reject) => {
    const request = require('request');
    const options = {
      url: `https://api.github.com/repos/${user}/${repo}/commits?author=${user}`,
      headers: {
        'User-Agent': `${user}`,
        'Authorization': `token ${token}`
      }
    };

    request(options, function (error, response, body) {
      if (error) {
        return reject(error);
      }
      return resolve(JSON.parse(body), dateArray);
    })
  })
}

// Only include commits that match user id
// Note: will need to handle pagination
// Note: will need to handle the case where user commits to repos that he/she does not own
// If commit list is sorted, we could stop searching after we are beyond 1 year
function getCommitContributions(res, dates, repos) {
  // For each repo, get all commits and iterate through them, keeping only those that match dates in last year (1 API call per repo)
  for (var repo = 0; repo < repos.length; repo++) {
    getRepositoryCommits(repos[repo])
    .then(function (res, dates) {
      for (var commit = 0; commit < res.length; commit++) {
        for (var date = 0; date < dates.length; date++) {
          var regex_date = new RegExp(dates[date], 'g');
          console.log(res[commit]["commit"]["committer"]["date"])
          if (res[commit]["commit"]["committer"]["date"].match(regex_date)) {
            contributionArray[date] += 1;
          }
        }
      }
    })
  }
}

function getRepositoryList(res) {
  for (var i = 0; i < res.length; i++) {
    repos.push(res[i].name);
  }
  return repos
}

function getRepositoryContributions(res, dates) {
  // for each repo in response, inspect created_at, updated_at, pushed_at
  // if it matches the 'date' increment contribution
  getCommitContributions(res, dates, getRepositoryList(res));

  // for (var d = 0; d < dates.length; d++) {

  //   for (var r = 0; r < res.length; r++) {
  //     var regex_date = new RegExp(dates[d], 'g');
  //     if (res[r].created_at.match(regex_date)) {
  //       contributionArray[r] += 1;
  //     }
  //     if (res[r].updated_at.match(regex_date)) {
  //       contributionArray[r] += 1;
  //     }
  //     if (res[r].pushed_at.match(regex_date)) {
  //       contributionArray[r] += 1;
  //     }
  //   }
  // }
  // console.dir(contributionArray);
}

function getRepositoryData(dates) {
  // Get repos - 1 API call
  const request = require('request');
  const options = {
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      'User-Agent': `${user}`,
      'Authorization': `token ${token}`
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const res = JSON.parse(body);
      // Now data is available scan it for all info needed
      getRepositoryContributions(res, dates);
      // getPullRequestContributions();

    }
    else {
      return console.error('Failed to get Repository Data:', error);
    }
  })
};

// ** WORKING BELOW **

// function sendRequest(requestUrl, callback) {
//   const request = require('request');
//   const options = {
//     url: requestUrl,
//     headers: {
//       'User-Agent': 'dmatis'
//     }
//   };
//   request(options, callback);
// }

// function callback(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     const res = JSON.parse(body);
//      //console.log(res);
//     return res;
//   }
// }


// ** UNCOMMENT WHEN READY **

dateArray = computeDateArray()
getRepositoryData(dateArray)

// Once we have repo data, we can keep only the relevant ones, Question, what if updated is enough (don't need to go through commits and PRs)


// Currently, this makes 365 calls to Github api
// Why not call it once and iterate over the data (store that data in a tmp file)
// for (var i = 0; i < dateArray.length; i++) {
//   getRepositoryContributions(dateArray[i], `https://api.github.com/users/${user}/repos`)
// }

// {
//   "message": "API rate limit exceeded for 169.145.3.56. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
//   "documentation_url": "https://developer.github.com/v3/#rate-limiting"
// }


