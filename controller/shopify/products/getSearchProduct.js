const request = require('request-promise');

module.exports = (req, res) => {
    try {
        const {search} = req.query;
        let url = 'https://' + req.query.shop + '/admin/products.json';

        if(search) {
            url +=`?title=${search}`;
        }

        let options = {
            method: 'GET',
            uri: url,
            json: true,
            resolveWithFullResponse: true,
            headers: {
                'X-Shopify-Access-Token': process.env.APP_STORE_TOKEN_TEST,
                'content-type': 'application/json'
            }
        };

        request(options)
        .then((parsedBody) => {
            res.json(parsedBody.body);
        })
        .catch(function (err) {
            res.json(err);
        });
    } catch (e) {
        console.log(e);
    }
};