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

function getRepositoryList(res) {
  for (var i = 0; i < res.length; i++) {
    repos.push(res[i].name);
  }
  return repos
}

function testParallel(dateArray) {

  // Get repos, then callback to the parallel function

  async.parallel({
      one: function(callback) {
          callback(null, 'abc\n');
      },
      two: function(callback) {
          callback(null, 'xyz\n');
      },
      three: function(callback) {
          getUserInfo(callback);
      }
    },
    function(err, results) {
      // results now equals to: results.one: 'abc\n', results.two: 'xyz\n'
      console.log(results.one)
      console.log(results.two)
      console.log(results.three)
    });
}

dateArray = computeDateArray()
// getRepositoryData()
testParallel(dateArray);
