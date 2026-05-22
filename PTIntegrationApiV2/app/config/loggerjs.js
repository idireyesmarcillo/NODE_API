var log4js = require('log4js');
var path = require('path');
require('dotenv').config();

log4js.configure({
  appenders: { 
    failer: { 
              type: 'file', 
              filename: path.join(process.env.LogPath,`${process.env.Name}-error.log`),
              pattern: `${process.env.DatePattern}`     
            },
    tracer: { 
              type: 'file', 
              filename: path.join(process.env.LogPath,`${process.env.Name}-info.log`),
              pattern: `${process.env.DatePattern}`   
            }
  },
  categories: { 
    error: { 
      appenders: ['failer'], level: 'error' 
    },
    default: { 
      appenders: ['tracer'], level: 'info' 
    },
  }
});

var logger = {
  info: log4js.getLogger('info'),
  error: log4js.getLogger('error')
}

module.exports = logger;
