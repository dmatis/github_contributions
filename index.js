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


// Currently working:
// GET repos: https://api.github.com/users/dmatis/repos



// Set this up as an input to the server
// var user = 'Dogild';
var user = 'dmatis';
var baseUrl = `https://api.github.com/users/${user}`

function getPullRequestContributions(date) {
  url = `https://api.github.com/repos/${user}/pulls/`
}

function getRepos() {
  sendRequest(`https://api.github.com/users/${user}`)
}


// ** WORKING BELOW **

function sendRequest(requestUrl) {
  const request = require('request');
  const options = {
    url: requestUrl,
    headers: {
      'User-Agent': 'dmatis'
    }
  };
  request(options, callback);
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    const info = JSON.parse(body);
    console.log(info);
  }
}



// Store results in an array
results = []
