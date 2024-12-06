const User = require("../models/User.js");
const generateToken = require("../jwt/generateToken");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");
const { StatusCodes } = require("http-status-codes");
const { STATUS_MESSAGE } = require("../constants/constants.js");


//registeruser
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_ALREADY_REGISTER, StatusCodes.BAD_REQUEST);
    }
    const user = new User({ username, email, password });
    await user.save();
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_REGISTER_SUCCESS, {}, StatusCodes.OK);
  } catch (error) {
    console.log(error);

    return sendErrorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

//login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_REGISTERED,
        StatusCodes.UNAUTHORIZED
      );
    }
    const token = generateToken(user._id);

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_LOGIN_SUCCESS, { token: token }, StatusCodes.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

//listUsers
const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_REGISTERED, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND, users, StatusCodes.OK);
  } catch (error) {
    return sendErrorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
//getsingleuser

const singleUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password");

    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.FORBIDDEN)
    }

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USER_FOUND, user, StatusCodes.OK)
  } catch (err) {
    return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

//acc delete
const accDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (id !== userId.toString()) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    user.isDeleted = true;
    await user.save();

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USER_DELETED, {}, StatusCodes.OK);
  } catch (err) {
    console.error(err);
    return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

//accRestore
// const accRestore = async (req, res) => {

//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     if (id !== userId.toString()) {
//       return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
//     }

//     const user = await User.findById(id);

//     if (!userId) {
//       return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_FOUND, StatusCodes.NOT_FOUND)
//     }

//     user.isDeleted = false;
//     await user.save();
//     return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USER_RESTORE, {}, StatusCodes.OK)
//   } catch (err) {
//     return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
//   }
// };



//uploadprofilePic
const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_PROFILE_UPLOAD_FAIL, StatusCodes.BAD_REQUEST)
    }
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_PROFILE_UPLOAD_SUCCESS, {}, StatusCodes.OK)
  } catch (err) {
    return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
};



module.exports = {
  registerUser,
  loginUser,
  listUsers,
  singleUser,
  accDelete,
  uploadProfilePic,
};
