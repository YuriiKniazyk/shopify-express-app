const request = require('request-promise');

module.exports = (req, res) => {
    try {
        let url = 'https://' + req.query.shop + '/admin/products/' + req.query.id + '.json';
        console.log(url);
        let options = {
            method: 'DELETE',
            uri: url,
            resolveWithFullResponse: true,//added this to view status code
            headers: {
                'X-Shopify-Access-Token': process.env.APP_STORE_TOKEN_TEST,
                'content-type': 'application/json'
            }
        };

        request.delete(options)
        .then(function (response) {
            if (response.statusCode == 200) {
                res.json({
                    success: true,
                    products: response.body
                });
            } else {
                res.json({
                    success: false
                });
            }

        })
        .catch(function (err) {
            console.log(err);
            res.json({
                success: false
            });
        });
    } catch (e) {
        console.log(e)
    }
};