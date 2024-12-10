const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");
const { STATUS_MESSAGE,STATUS_CODE } = require('../constants/constants.js');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname))
    }
})

const upload = multer({
    storage: fileStorageEngine,
    limits: { fileSize: 1024 * 1024 * 2 }
})
    .single('image')

const resizeImage = (filePath) => {
    const resolutions = {
        low: { width: 64, height: 64 },
        mid: { width: 128, height: 128 },
        high: { width: 240, height: 240 }
    };

    return Promise.all(Object.entries(resolutions)
        .map(([key, { width, height }]) => {
            return sharp(filePath)
                .resize(width, height)
                .toFile(`./images/${key}-${path.basename(filePath)}`);
        }));
};


const uploadAndResizeImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return sendErrorResponse(res, err.message,
                STATUS_CODE.BAD_REQUEST);
        }
        try {
            await resizeImage(req.file.path);
            return sendSuccessResponse(res, 
                STATUS_MESSAGE.MSG_FILE_UPLOAD_RESIZE,{}, STATUS_CODE.OK);

        } catch (err) {
            return sendErrorResponse(res, error.message,
                STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
    });
};

module.exports = uploadAndResizeImage;

