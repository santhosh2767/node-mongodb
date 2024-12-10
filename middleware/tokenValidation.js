const jwt = require("jsonwebtoken");
const {User} = require("../models/indexModel");
const { sendErrorResponse } = require("../utils/utils");
const { STATUS_MESSAGE,STATUS_CODE } = require("../constants/constants");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendErrorResponse(res, STATUS_MESSAGE.MSG_TOKEN_REQUIRED,
      STATUS_CODE.FORBIDDEN);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USERS_INVALID,
        STATUS_CODE.FORBIDDEN);
    }
    req.user = user;
    next();

  } catch (err) {
    return sendErrorResponse(res, STATUS_MESSAGE.MSG_TOKEN_INVALID,
      STATUS_CODE.UNAUTHORIZED);
  }
};

module.exports = authMiddleware;
