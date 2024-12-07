const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) ; 
    const limit = parseInt(req.query.limit) ; 
  
    req.pagination = {
      skip: (page - 1) * limit,
      limit,
      page,
    };
  
    next(); 
  };
  
  module.exports = paginationMiddleware;
  