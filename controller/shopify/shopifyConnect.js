const cookie = require('cookie');
const nonce = require('nonce')();

module.exports = (req, res) => {
    try {
        const shop = req.query.shop;
        if (shop) {
            const state = nonce();
            const redirectUri = process.env.FORWARDING_ADDRESS + '/shopify/callback';
            const installUrl = 'https://' + shop +
                '/admin/oauth/authorize?client_id=' + process.env.SHOPIFY_API_KEY +
                '&scope=' + process.env.SCOPES +
                '&state=' + state +
                '&redirect_uri=' + redirectUri;
            res.cookie('state', state);
            res.redirect(installUrl);
        } else {
            return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
        }
    } catch (e) {
        console.log(e)
    }
};
