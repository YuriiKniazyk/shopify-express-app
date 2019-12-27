const request = require('request-promise');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|gif|PNG|JPG|jpeg|JPEG)$/)) {
        return cb(new Error('Only image files are allowed.'), false);
    }
    cb(null, true);
};
const limit = {fileSize: 8000000};
const upload = multer({storage: storage, limits: limit, fileFilter: imageFilter}).array('file', 50);

module.exports = (req, res) => {
    try {
        upload(req, res, function (err) {
            if (err) {
                if (err.code == 'LIMIT_FILE_SIZE') {
                    //console.log(err);
                    res.status(413).json({ error: err.message });
                } else {
                    //console.log(err);
                    res.status(413).json({ error: err.message });
                }
            } else {

                let url = 'https://' + req.query.shop + '/admin/products/' + req.query.id + '.json';

                let update_product = {
                    product: {
                        id: req.query.id,
                        images: [
                            {
                               src: process.env.FORWARDING_ADDRESS + '/uploads/' + req.files[0].filename
                            }
                        ]
                    }
                };

                let options = {
                    method: 'PUT',
                    uri: url,
                    json: true,
                    resolveWithFullResponse: true,//added this to view status code
                    headers: {
                        'X-Shopify-Access-Token': process.env.APP_STORE_TOKEN_TEST,
                        'content-type': 'application/json'
                    },
                    body: update_product
                };

                request.put(options)
                .then(function (response) {
                    //console.log(response.body);
                    if (response.statusCode == 200) {
                        res.json({
                            message: 'uploaded',
                            product: response.body
                        });
                    } else {
                        res.json({
                            message: 'fail to upload',
                            product: null
                        });
                    }
                })
                .catch(function (err) {
                    res.json({
                        message: 'error',
                        err
                    });
                });
            }

        });
    } catch (e) {
       console.log(e);
    }
};