# zanest-electron
zanest app Implementation with electron.js

## Management App For English Learning Institutions

### How To Run The Project
install node.js on your machine then in the repo directory run following 2 commands:
```bash
npm install 
npm start
```
### Run Unit Test
`Mocha` is a testing framework for Node.js that gives you the flexibility to run asynchronous (or synchronous) code serially. Any uncaught exceptions are shown alongside the test case in which it was thrown, making it easy to identify exactly what failed and why.

To use Mocha, I'd suggest you install it globally with npm:
```bash
$ npm install mocha -g
```
We Use docker containers to create an independent and always clean environment for testing application.

docker installition Guide:
* [MacOs](https://docs.docker.com/docker-for-mac/install/)
* [Windows](https://docs.docker.com/docker-for-windows/install/)
* [Linux](https://docs.docker.com/engine/install/)

Congratulations! You have set up Docker on your system and  now you can testing the application with the below command:
```bash
docker build -t tester . && docker run --rm -e ENVIRONMENT=test tester
```
