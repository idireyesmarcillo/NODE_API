function HandelHttpError(res, err) {
    if (err && (err.status == null || err.status == undefined)) {
      res.status(200).json({
        status: false,
        message: err
      });
      return
    }
  
    else if (err.status == 404) {
      res.status(200).json({
        status: false,
        message: err.message
      });
      return
    }
  
    else if (err.status == 400) {
      res.status(200).json({
        status: false,
        message: err.message
      });
      return
    }
  
    else if (err) {
      res.status(200).json({
        status: false,
        message: err
      });
      return
    }
    else {
      switch (res.statusCode) {
        case 500:
          res.status(200).json({
            status: false,
            message: Messages.Something_Went_Wrong
          });
  
          break;
        case 400:
          res.status(200).json({
            status: false,
            message: Messages.Something_Went_Wrong
          });
          break;
        case 404:
          res.status(200).json({
            status: false,
            message: Messages.Something_Went_Wrong
          });
          break;
        default:
          res.status(200).json({
            result: result,
            status: true,
            message: ""
          });
          break;
      }
    }
  }
  
  function HandelHttpSuccess(res, result, massage = "") {
    res.status(200).json({
      status: true
    })
  }
  module.exports = { HandelHttpError, HandelHttpSuccess}