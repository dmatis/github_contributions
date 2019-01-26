// TODO:
// Write a function() for generic web request
// Write a function() for each request type
// Write a function() for combining all the contribution types

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


// Set this up as an input to the server
// var user = 'Dogild';
var user = 'dmatis';
var baseUrl = `https://api.github.com/users/${user}`

var dateArray = []
var contributionArray = []

// Get today's date and compute the formatted dates for a year
function computeDateArray() {
  var now = new Date();

  for (var i = 0; i < 365; i++) {
    var pastDate = new Date();
    pastDate.setDate(now.getDate() + i - 365)
    dateArray[i] = pastDate.toISOString().slice(0, 10);
  }
}

function getPullRequestContributions(date) {
  url = `https://api.github.com/repos/${user}/pulls/`
}

// Includes the following repository activity that match for a given date:
// Created
// Updated
// Pushed
function getRepositoryContributions(date, requestUrl) {
  // Get repos
  const request = require('request');
  const options = {
    url: requestUrl,
    headers: {
      'User-Agent': 'dmatis'
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const res = JSON.parse(body);
      // for each repo in response, inspect created_at, updated_at, pushed_at
      // if it matches the 'date' keep it in an array
      for (var i = 0; i < res.length; i++) {
        var regex_date = new RegExp(date, 'g');
        if (res[i].created_at.match(regex_date)) {
          console.log(res[i].created_at);
        }
      }
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

computeDateArray()
for (var i = 0; i < dateArray.length; i++) {
  getRepositoryContributions(dateArray[i], `https://api.github.com/users/${user}/repos`)
}
//getRepositoryContributions("2015-07-29", `https://api.github.com/users/${user}/repos`)

