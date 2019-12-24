const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const fs = require('fs');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'write_products';
const forwardingAddress = "https://94ada2d7.ngrok.io";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;

        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});
sfsdf
app.get('/shopify/callback', (req, res) => {
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
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        }
        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        // DONE: Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                fs.writeFile("accessToken.txt", accessToken, function(error){

                    if(error) throw error; // если возникла ошибка
                    console.log("Write file done. Content:");
                    let data = fs.readFileSync("accessToken.txt", "utf8");
                    console.log(data);  // выводим считанные данные
                });
                // DONE: Use access token to make API call to 'shop' endpoint
                const shopRequestUrl = 'https://' + shop + '/admin/api/2019-10/products.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        res.status(200).end(shopResponse);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });

    } else {
        res.status(400).send('Required parameters missing');
    }
});

app.post('/app/create-product', function (req, res) {
    let new_product = {
        product: {
            title: req.body.title,
            body_html: req.body.body_html,
            vendor: req.body.vendor,
            product_type: req.body.product_type,
            tags: req.body.tags
        }
    };
    let url = 'https://' + req.query.shop + '/admin/products.json';

    let options = {
        method: 'POST',
        uri: url,
        json: true,
        resolveWithFullResponse: true,//added this to view status code
        headers: {
            'X-Shopify-Access-Token': process.env.appStoreTokenTest,
            'content-type': 'application/json'
        },
        body: new_product//pass new product object - NEW - request-promise problably updated
    };

    request.post(options)
        .then(function (response) {
            console.log(response.body);
            if (response.statusCode == 201) {
                res.json(true);
            } else {
                res.json(false);
            }
        })
        .catch(function (err) {
            console.log(err);
            res.json(false);
        });
});

app.get('*', (req, res) => {
    res.status(404).json('Page not found!!!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});