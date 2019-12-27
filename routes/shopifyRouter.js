const router = require('express').Router();
const shopifyController = require('../controller');

router.get('/shopify', shopifyController.ShopifyConnect);
router.get('/shopify/callback', shopifyController.GetToken);
router.get('/shopify/product', shopifyController.GetSearchProduct);
router.post('/shopify/create-product', shopifyController.CreateProduct);
router.post('/shopify/file-upload', shopifyController.FileUpload);
router.post('/shopify/delete', shopifyController.DeleteProduct);

module.exports = router;