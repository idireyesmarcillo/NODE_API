const express = require('express');
const router = express.Router();
const controller = require("../controllers/api.controller.js");


/*
module.exports = (app) => {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
    next();
  });
  
  app.post("/events", controller.camdata);

  app.use("/auth",app);
  return app;
};
*/

router.post("/genetec/events", controller.camdata);
router.post("/insight/events", controller.camInsight);
router.post("/logger/events", controller.camlogger);
module.exports = router;

