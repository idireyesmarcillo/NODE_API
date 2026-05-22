const express = require("express");
const cors = require("cors");
const router = express.Router()
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();

var corsOptions = {
  origin: "*",
  methods: "*",
  optionsSuccessStatus: 200
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// parse requests of content-type - application/json
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static('app')); 
// routes

// Api
app.use('/api/v1',require('./app/routes/api.routes'))

//app.use('/api/v1/genetec/',require('./app/routes/api.routes')(router))

// set port, listen for requests
const PORT = process.env.PORT || 7113;

if(process.env.HTTPS==1){
    console.log('Getting in HTTPS');
    // Https server Credentials
    const credentials = {
            key:  fs.readFileSync(process.env._KEY),
            cert: fs.readFileSync(process.env._CERT)
        };

    // Begin - Https server
     const httpsServer = https.createServer(credentials, app);
     httpsServer.listen(process.env.PORT, ()=>{
         console.log(`🚀 Server running on port ${PORT} as HTTPS`);
     });
    // End   - Https server
	
}else{
    console.log('Getting in HTTP');

	app.listen(PORT, () => {
	  console.log(`🚀 Server is running on port ${PORT} as HTTP.`);
	}); 
}