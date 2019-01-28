# github_contributions
An app that displays a users contributions over a given period

## To start the server
`npm install`
`node index.js`

## To Generate results:
`curl localhost:3000/get_contributions?user=<user>`


## Docker Build Instructions

Build the image (Note you will need to change the username in the Dockerfile prior to building):
`docker build . -t github-contributions:latest`

Run the container:
`docker run -it -p3000:3000 github-contributions:latest`

