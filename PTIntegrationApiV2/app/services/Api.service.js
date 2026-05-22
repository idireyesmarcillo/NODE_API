var logger = require("../config/loggerjs.js");
require('dotenv').config();
const fs = require('fs');
var xml2js = require('xml2js');
var moment = require('moment');
const path = require('path');

var unqId = 1;
var CounterDate = new Date().toDateString();
var ApiService = {
    camdata: async function (req, result) {
        try{
            var body = req.body;

            //logger.info.info('New Request ');

            logger.info.info('Request From Camera: Genetec - '+ (body.CameraName||'N/A'));

            //var Xmlfilepath = process.env.XmlPath;
            var Xmlfilepath = path.join(process.env.XmlPath, 'genetec');
            var Requestfilepath = path.join(process.env.RequestPath, 'genetec'); 

            var images = [];
            if(CounterDate != new Date().toDateString()){
                CounterDate = new Date().toDateString();
                unqId = 1;
            }
            unqId++;
            images.push({ plate: body.PlateImage, context: body.ContextImage });

            
            const thedatetime = moment(`${body.DateLocal} ${body.TimeLocal}`,'MM/DD/YYYY HH:mm:ss');
            //console.log(`${thedatetime.format('YYYY-MM-DD HH:mm:ss')}`);
            //console.log(`${thedatetime.format('YYYYMMDDHHmmss')}`);
            
            var xmlJson = {
                id: unqId++,
                eventTime: `${thedatetime.format('YYYY-MM-DD HH:mm:ss')}`,				
                plate: body.Plate,
                camera: body.CameraName,
                ismobile: "0",
				bosscamera: body.bosscamera || body.CameraName,
                plateColor: null,
                vehicleColor: null,
                vehicleSize: null,
                vehicleType: null,
                vehicleSign: body.Attributes["Vehicle Make"] || null,
                region:  body.State,
                latitude: body.Latitude,
                longitude: body.Longitude,
                images: images
            };
                        
            var filename = xmlJson.id + "_" + body.Plate + "_" + `${thedatetime.format('YYYYMMDDHHmmss')}`+'_'+Date.now();

            //logger.info.info(`Calling the saver of the file`);
            this.saveXMLFile(Xmlfilepath,filename,xmlJson);
            //logger.info.info(`After the call of saver of the file`);
            if(process.env.SAVEREQUEST==1)
                this.saveJsonFile(Requestfilepath,filename,req);
            
            result(null, null);
        }
        catch(e){
            logger.error.error(e.message);
            result(null, null);
        }
    },

    camInsight: async function (req, result) {
        try{
            var body = req.body;

            //logger.info.info('New Request ');           
            
            logger.info.info('Request From Camera: Insight - '+ (body.CameraName||'N/A'));
            
            var Xmlfilepath = path.join(process.env.XmlPath, 'insight');
            var Requestfilepath = path.join(process.env.RequestPath, 'insight'); 

            var images = [];
            if(CounterDate != new Date().toDateString()){
                CounterDate = new Date().toDateString();
                unqId = 1;
            }
            unqId++;
            images.push({ plate: body.PlateImage, context: body.ContextImage });

            
            const thedatetime = moment(`${body.DateTime}`);
            //console.log(`${thedatetime.format('YYYY-MM-DD HH:mm:ss')}`);
            //console.log(`${thedatetime.format('YYYYMMDDHHmmss')}`);
            
            var thelat = null;
            var thelong = null;

            if(body.GPSPosition){
                var thecoordinates =   body.GPSPosition.split(",");
                thelat = thecoordinates[0];
                thelong = thecoordinates[1];
            }

            var xmlJson = {
                id: unqId++,
                eventTime: `${thedatetime.format('YYYY-MM-DD HH:mm:ss')}`,				
                plate: body.Plate,
                camera: body.CameraName,
                ismobile: "0",
				bosscamera: null,
                plateColor: null,
                vehicleColor: body.VehicleColor,
                vehicleSize: null,
                vehicleType: body.VehicleType,
                vehicleSign: null,
                region:  null,
                latitude: thelat,
                longitude: thelong,
                images: images
            };            
            
            var filename = xmlJson.id + "_" + body.Plate + "_" + `${thedatetime.format('YYYYMMDDHHmmss')}`+'_'+Date.now();
            
            //logger.info.info(`Calling the saver of the file`);
            this.saveXMLFile(Xmlfilepath,filename,xmlJson);
            //logger.info.info(`After the call of saver of the file`);
            if(process.env.SAVEREQUEST==1)
                this.saveJsonFile(Requestfilepath,filename,req);
            
            result(null, null);
        }
        catch(e){
            logger.error.error(e.message);
            result(null, null);
        }
    },

    camlogger: async function (req, result) {
        try{            

            var body = req.body;
            logger.info.info('Request From Camera: logger - '+ (body.CameraName||'N/A'));

            //var Xmlfilepath = process.env.XmlPath;
            var Requestfilepath =  path.join(process.env.RequestPath, 'logger');   

            if(CounterDate != new Date().toDateString()){
                CounterDate = new Date().toDateString();
                unqId = 1;
            }

            unqId++;
            
            //const thedatetime = moment(`${Date.now()}`,'MM/DD/YYYY HH:mm:ss');            
            const thedatetime = moment().format('YYYYMMDDHHmmss');
            var filename = unqId + "_" + `${thedatetime}`;

			this.saveJsonFile(Requestfilepath,filename,req);
            
            result(null, null);
        }
        catch(e){
            logger.error.error(e.message);
            result(null, null);
        }
    },


    saveXMLFile: function (Xmlfilepath,filename,xmlJson){
        try{
            //logger.info.info(`Attemp to create XML: ${Xmlfilepath} ${filename}`);

            if (!fs.existsSync(Xmlfilepath)) {
                logger.info.info(`Directory doesnt exist going to create: ${Xmlfilepath}`);
                // If it doesn't exist, create the directory                
                fs.mkdirSync(Xmlfilepath, { recursive: true });
            }

            var builder = new xml2js.Builder({rootName: "EventPT"});
            var xml = builder.buildObject(xmlJson);    

            var xmlpath= path.join(Xmlfilepath , filename+'.xml' );
            xmlpath = xmlpath.replace('-','_');

            if(fs.existsSync(xmlpath)){
                logger.info.info('xmlpath exists so it will be removed');
                fs.unlinkSync(xmlpath);
            }

            fs.writeFile(xmlpath, xml, function (err) {
                if (err) {
                    logger.error.error(err.message);
                };
                logger.info.info("New Event XML Created: " + filename);
            });
            
            
        }
        catch(e){
            logger.error.error(e.message);            
        }
    },

    saveJsonFile: function(Requestfilepath,filename,req){
        try{
            //logger.info.info(`Attemp to create JSON: ${Requestfilepath} ${filename}`);
        
            if (!fs.existsSync(Requestfilepath)) {
                logger.info.info(`Directory doesnt exist going to create: ${Requestfilepath}`);
                // If it doesn't exist, create the directory                
                fs.mkdirSync(Requestfilepath, { recursive: true });
            }

            var requestpath=path.join(Requestfilepath , filename +'.json') ;
            
            if(fs.existsSync(requestpath)){
                fs.unlinkSync(requestpath);
            }

            var jsonData = JSON.stringify( { headers: req.headers, body: req.body } , null, 2);

            fs.writeFile(requestpath.replace('-','_'), jsonData, function (err) {
                if (err) {
                    logger.error.error(err.message);
                };
                logger.info.info("New Event JSON Created: "+ requestpath);
            });		
        }
        catch(e){
            logger.error.error(e.message);            
        }	        
    }
}

module.exports = ApiService;
