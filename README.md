# github_contributions
An app that displays a users contributions over a given period

## To run
`npm install`
`node index.js <user>`


## Docker Build Instructions

Build the image (Note you will need to change the username in the Dockerfile prior to building):
`docker build . -t github-contributions:latest`

Run the container:
`docker run -it github-contributions:latest`

