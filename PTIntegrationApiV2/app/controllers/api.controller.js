const ApiService = require('../services/Api.service');
const { HandelHttpSuccess, HandelHttpError } = require('../config/constants')

var ApiController = {

    camdata(req, res) {
        ApiService.camdata(req, (err, result) => {
            if (err) {
                HandelHttpError(res, err)
            }else{
                HandelHttpSuccess(res, result)
            }
        });
    },
    camInsight(req, res) {
        ApiService.camInsight(req, (err, result) => {
            if (err) {
                HandelHttpError(res, err)
            }else{
                HandelHttpSuccess(res, result)
            }
        });
    },
    camlogger(req, res) {
        ApiService.camlogger(req, (err, result) => {
            if (err) {
                HandelHttpError(res, err)
            }else{
                HandelHttpSuccess(res, result)
            }
        });
    }

}

module.exports = ApiController;
