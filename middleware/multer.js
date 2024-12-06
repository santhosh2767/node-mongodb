const multer = require('multer');
const path = require('path');
const sharp = require('sharp')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images")
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname))
    }
})

const upload = multer({ storage: fileStorageEngine, limits: { fileSize: 1024 * 1024 * 2 } }).single('image')

const resizeImage = (filePath) => {
    const resolutions = {
        low: { width: 64, height: 64 },
        mid: { width: 128, height: 128 },
        high: { width: 240, height: 240 }
    };

    // return Promise.all(Object.entries(size).map(([key, size]) => {
    //     return sharp(filePath)
    //         .resize({ width: size, height: size, fit: sharp.fit.inside })
    //         .toFile(`./images/${key}-${path.basename(filePath)}`);

            return Promise.all(Object.entries(resolutions).map(([key, { width, height }]) => {
                return sharp(filePath)
                    .resize(width, height) 
                    .toFile(`./images/${key}-${path.basename(filePath)}`);
    }));
};


const uploadAndResizeImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: 'File upload failed' });
        }

        try {
            await resizeImage(req.file.path);
            res.status(200).send({
                message: 'File uploaded and resized successfully',
            });
        } catch (err) {
            console.log(err);
            
            res.status(500).send({ error: 'Error resizing the image' });
        }
    });
};

module.exports = uploadAndResizeImage;

