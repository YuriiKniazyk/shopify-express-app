const express = require('express');
const app = express();
const cors = require('cors');
const {resolve: resolvePath} = require('path');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolvePath(__dirname, 'public')));

let whitelist = ['http://localhost:63342'];
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", '*');
    next();
});
app.use('/', cors(corsOptions), routes.ShopifyRouter);

app.get('*', (req, res) => {
    res.status(404).json('Page not found!!!');
});

app.listen(3002, () => {
    console.log('Example app listening on port 3002!');
});