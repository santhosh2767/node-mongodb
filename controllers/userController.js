const {User} = require("../models/indexModel")
const generateToken = require("../jwt/generateToken");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");
const { STATUS_MESSAGE,STATUS_CODE } = require("../constants/constants.js");


//registeruser
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_ALREADY_REGISTER,
        STATUS_CODE.BAD_REQUEST);
    }

    const user = new User({ username, email, password });
    await user.save();

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_REGISTER_SUCCESS,
      {}, STATUS_CODE.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

//login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_REGISTERED,
        STATUS_CODE.UNAUTHORIZED);
    }

    const token = generateToken(user._id);

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_LOGIN_SUCCESS,
      { token: token }, STATUS_CODE.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

//listUsers 
const listUsers = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1
      : req.query.sortOrder === 'asc' ? 1 : -1;

    const users = await User.find().populate('username email')
      .select("-password").skip(skip).limit(limit).sort({ [sortBy]: sortOrder })

    const totalDocuments = await User.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    if (users.length === 0) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_REGISTERED,
        STATUS_CODE.NO_CONTENT);
    }
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USERS_FOUND,
      { page, limit, totalPages, totalDocuments, users }, STATUS_CODE.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};
//getsingleuser

const singleUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password");

    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND,
        STATUS_CODE.FORBIDDEN)
    }
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USER_FOUND,
      user, STATUS_CODE.OK)
  } catch (err) {
    return sendErrorResponse(res, err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}

//acc delete
const accDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (id !== userId.toString()) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH,
        STATUS_CODE.FORBIDDEN);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND);
    }

    user.isDeleted = true;
    await user.save();

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_USER_DELETED,
      {}, STATUS_CODE.OK);
  } catch (err) {
    console.error(err);
    return sendErrorResponse(res, err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};


//uploadprofilePic
const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_PROFILE_UPLOAD_FAIL,
        STATUS_CODE.BAD_REQUEST)
    }
    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_PROFILE_UPLOAD_SUCCESS,
      {}, STATUS_CODE.OK)
  } catch (err) {
    return sendErrorResponse(res, err.message, 
      STATUS_CODE.INTERNAL_SERVER_ERROR)
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
