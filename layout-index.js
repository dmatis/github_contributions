var async = require("async");
var user = 'amilner42';
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

function getPullRequestContributions(date) {
  url = `https://api.github.com/repos/${user}/${repo}/pulls`
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
          callback(null, 'xyz\n');
      },
      three: function(callback) {
          getUserInfo(callback);
      }
    },
    function(err, results) {
      console.log(results.one) // THIS GETS OUR COMMIT CONTRIBUTIONS
      // console.log(results.two)
      // console.log(results.three)
    });
}



dateArray = computeDateArray()
getRepositoryList(function(repos) {
  testParallel(dateArray, repos);
})
