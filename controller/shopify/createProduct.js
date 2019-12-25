const request = require('request-promise');

module.exports = (req, res) => {
    try {
        const {title, body_html, vendor, product_type, tags} = req.body;
        let new_product = {
            product: {
                title,
                body_html,
                vendor,
                product_type,
                tags
            }
        };
        let url = 'https://' + req.query.shop + '/admin/products.json';

        let options = {
            method: 'POST',
            uri: url,
            json: true,
            resolveWithFullResponse: true,//added this to view status code
            headers: {
                'X-Shopify-Access-Token': process.env.APP_STORE_TOKEN_TEST,
                'content-type': 'application/json'
            },
            body: new_product
        };

        request.post(options)
        .then((response) => {
            if (response.statusCode == 201) {
                res.json({
                    success: true,
                    product: new_product
                });
            } else {
                res.json({
                    success: false,
                    product: []
                });
            }
        })
        .catch(function (err) {
            res.json({
                success: false,
                err
            });
        });
    } catch (e) {
        console.log(e)
    }
};