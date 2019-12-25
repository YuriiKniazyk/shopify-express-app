const request = require('request-promise');

module.exports = (req, res) => {

    let url = 'https://' + req.query.shop + '/admin/products.json';

    let options = {
        method: 'GET',
        uri: url,
        json: true,
        headers: {
            'X-Shopify-Access-Token': process.env.APP_STORE_TOKEN_TEST,
            'content-type': 'application/json'
        }
    };

    request(options)
    .then(function (parsedBody) {
        console.log(parsedBody);
        res.json(parsedBody);
    })
    .catch(function (err) {
        console.log(err);
        res.json(err);
    });
};