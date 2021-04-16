const { createLogger, format, transports } = require('winston');

// transports options
const options = {
  file: {
    filename: `./logs/zanest.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// log
const logConfiguration = {
  transports: [
	  new transports.Console(options.console),
	  new transports.File(options.file),
  ],

  format: format.combine(
    format.label({label: `Label🏷️`}),
    format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    format.align(),
    format.printf(info => `${info.level}:  ${info.label}: ${[info.timestamp]}: ${info.message}`),
  )
  
};

/*
* The createLogger method is one that takes a config object and returns a logger object 
* with several methods bound to it which are your logging levels
*/
const logger = createLogger(logConfiguration);


// ==================================================================================
// LOG METHOD
// ==================================================================================
exports.log = class log {

  static async record(level, message) {
    
    // The full list of default levels that come out-of-the-box with Winston are:
    // error: 0, 
    // warn: 1, 
    // info: 2, 
    // http: 3,
    // verbose: 4, 
    // debug: 5, 
    // silly: 6

    logger.log(level, message)
  }

}