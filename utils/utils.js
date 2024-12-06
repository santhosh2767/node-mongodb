function sendErrorResponse(res, data, code) {
  return res.status(code).json({
    statusCode: code,
    message: data
  });
}



function removeEmptyValues(obj) {
  for (const key in obj) {
    console.log(obj[key]);
    if (
      obj[key] === null || 
      obj[key] === undefined || 
      (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) 
    ) {
      delete obj[key];
    }
  }
  return obj;
}

function sendSuccessResponse(res, msg, data, code) {
  const response = {
    statusCode: code,
    message: msg,
    data: data,
  };

  removeEmptyValues(response);

  return res.status(code).json(response);
}


module.exports = { sendErrorResponse, sendSuccessResponse }