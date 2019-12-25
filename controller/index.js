const CreateProduct = require('./shopify/createProduct');
const GetToken = require('./shopify/getToken');
const ShopifyConnect = require('./shopify/shopifyConnect');
const FileUpload = require('./shopify/fileUpload');
const GetProduct = require('./shopify/getProduct');
const DeleteProduct = require('./shopify/deleteProduct');

module.exports = {
    CreateProduct,
    GetToken,
    ShopifyConnect,
    FileUpload,
    GetProduct,
    DeleteProduct
};