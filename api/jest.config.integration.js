const config = require('./jest.config');
config.testRegex = 'spec\\.int\\.ts$'; //Overriding testRegex option
console.log('RUNNING INTEGRATION TESTS');
module.exports = config;
