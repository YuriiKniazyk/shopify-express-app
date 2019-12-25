const crypto = require('crypto');
const cookie = require('cookie');
const dotenv = require('dotenv').config();
const querystring = require('querystring');
const request = require('request-promise');
const fs = require('fs');

module.exports = (req, res) => {
    try {
        const { shop, hmac, code, state } = req.query;
        const stateCookie = cookie.parse(req.headers.cookie).state;

        if (state !== stateCookie) {
            return res.status(403).send('Request origin cannot be verified');
        }

        if (shop && hmac && code) {
            // DONE: Validate request is from Shopify
            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];
            const message = querystring.stringify(map);
            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
                crypto
                    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
                    .update(message)
                    .digest('hex'),
                'utf-8'
            );
            let hashEquals = false;

            try {
                hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
            } catch (e) {
                hashEquals = false;
            }
            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }

            // DONE: Exchange temporary code for a permanent access token
            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code,
            };

            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;

                fs.writeFile("accessToken.txt", accessToken, function(error){
                    if(error) throw error;
                    console.log("Write file done!!!!");
                });

                // DONE: Use access token to make API call to 'shop' endpoint
                const shopRequestUrl = 'https://' + shop + '/admin/api/2019-04/products.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                .then((shopResponse) => {
                    res.status(200).end(shopResponse);
                })
                .catch((error) => {
                    console.log(error)
                    res.status(error.statusCode).send(error.error.error_description);
                });
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });
        } else {
            res.status(400).send('Required parameters missing');
        }
    } catch (e) {
        console.log(e);
    }
};