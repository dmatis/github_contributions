var async = require("async");
var user = 'Dogild';
var userInfo = {};
var repos = [];
var token = 'd0842c628bb93efa5cc576633e9034f90b637580';
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
      callback(null, JSON.parse(body));
    }
    else {
      return console.error('Failed to get User Info:', error);
    }
  });
}

function formattedRepositoryList(res) {
  for (var i = 0; i < res.length; i++) {
    repos.push(res[i].name);
  }
  return repos
}

function getRepositoryList(callback) {
  // Get repos: 1 API call
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
      callback(formattedRepositoryList(res))
    }
    else {
      return console.error('Failed to get Repository Data:', error);
    }
  })
};

function getPullRequestContributions(dates, repos, callback) {

  async.map(repos, function (repo, callback) {
    const request = require('request');
    const options = {
      url: `https://api.github.com/repos/${user}/${repo}/pulls`,
      headers: {
        'User-Agent': `${user}`,
        'Authorization': `token ${token}`
      }
    };

    // TODO: Maxes out at 30 items, need to paginate for more
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const pullRequests = JSON.parse(body);
        callback(null, pullRequests);
      }
      else {
        return console.error(`Failed to get Pull Requests from the repo ${repo}:`, error);
      }
    })
  }, function(err, results) {
      var pullRequestContributionArray = new Array(365).fill(0);

      for (var r = 0; r < results.length; r++) {
        if (results[r] != undefined && results[r].length > 0) {
          for (var p = 0; p < results[r].length; p++) {

            for (var date = 0; date < dates.length; date++) {
              var regex_date = new RegExp(dates[date], 'g');

              if ((results[r][p]["user"]["login"] == user) && (results[r][p]["created_at"].match(regex_date))) {
                pullRequestContributionArray[date] += 1;
              }
            }
          }
        }
      }

      // This will deliver the final data back to our eventual function to sum up all the pieces
      callback(null, pullRequestContributionArray);
  });
}


// Need to filter out results that are not created by user
function getIssueContributions(dates, repos, callback) {

  async.map(repos, function (repo, callback) {

    const request = require('request');
    const options = {
      // Only return results from the past year
      url: `https://api.github.com/repos/${user}/${repo}/issues?since=${dates[0]}T00:00:00Z`,
      headers: {
        'User-Agent': `${user}`,
        'Authorization': `token ${token}`
      }
    };

    // TODO: Maxes out at 30 items, need to paginate for more
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const issues = JSON.parse(body);
        callback(null, issues);
      }
      else {
        return console.error(`Failed to get issues from the repo ${repo}:`, error);
      }
    })
  }, function(err, results) {
      var issueContributionArray = new Array(365).fill(0);

      for (var r = 0; r < results.length; r++) {
        if (results[r] != undefined && results[r].length > 0) {
          for (var i = 0; i < results[r].length; i++) {

            for (var date = 0; date < dates.length; date++) {
              var regex_date = new RegExp(dates[date], 'g');

              if ((results[r][i]["user"]["login"] == user) && (results[r][i]["created_at"].match(regex_date))) {
                issueContributionArray[date] += 1;
              }
            }
          }
        }
      }
      // This will deliver the final data back to our eventual function to sum up all the pieces
      callback(null, issueContributionArray);
  });

}

function getCommitContributions(dates, repos, callback) {

  async.map(repos, function (repo, callback) {

    const request = require('request');
    const options = {
      // Only return results from the past year
      url: `https://api.github.com/repos/${user}/${repo}/commits?author=${user}&since=${dates[0]}T00:00:00Z`,
      headers: {
        'User-Agent': `${user}`,
        'Authorization': `token ${token}`
      }
    };

    // TODO: Maxes out at 30 commits, need to paginate for more
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const commits = JSON.parse(body);
        callback(null, commits);
      }
      else {
        return console.error(`Failed to get commits from the repo ${repo}:`, error);
      }
    })
  }, function(err, results) {
      var commitContributionArray = new Array(365).fill(0);

      for (var r = 0; r < results.length; r++) {
        if (results[r] != undefined && results[r].length > 0) {
          for (var c = 0; c < results[r].length; c++) {

            for (var date = 0; date < dates.length; date++) {
              var regex_date = new RegExp(dates[date], 'g');

              if (results[r][c]["commit"]["committer"]["date"].match(regex_date)) {
                commitContributionArray[date] += 1;
              }
            }
          }
        }
      }

      // This will deliver the final data back to our eventual function to sum up all the pieces
      callback(null, commitContributionArray);
  });
}

function testParallel(dateArray, repos) {

  async.parallel({
      one: function(callback) {
          getCommitContributions(dateArray, repos, callback);
      },
      two: function(callback) {
          getIssueContributions(dateArray, repos, callback);
      },
      three: function(callback) {
          getPullRequestContributions(dateArray, repos, callback);
      }
    },
    function(err, results) {
      var combinedResults = results.one + results.two + results.three
      const fs = require('fs');
      fs.writeFile('output.txt', combinedResults, (err) => {
        if (err) throw err;
      })
    });
}

if (process.argv[2] != undefined) {
  user = process.argv[2]
}

console.log(`Generating Github Contributions for ${user}`);
console.log("Results will be stored in output.txt");
dateArray = computeDateArray()
getRepositoryList(function(repos) {
  testParallel(dateArray, repos);
})
