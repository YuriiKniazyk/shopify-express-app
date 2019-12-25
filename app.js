const express = require('express');
const app = express();
const {resolve: resolvePath} = require('path');
const routes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolvePath(__dirname, 'public')));

app.use('/', routes.ShopifyRouter);

app.get('*', (req, res) => {
    res.status(404).json('Page not found!!!');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});