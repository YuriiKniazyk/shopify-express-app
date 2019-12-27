const CreateProduct = require('./shopify/products/createProduct');
const GetToken = require('./shopify/getToken');
const ShopifyConnect = require('./shopify/shopifyConnect');
const FileUpload = require('./shopify/products/fileUpload');
const GetSearchProduct = require('./shopify/products/getSearchProduct');
const DeleteProduct = require('./shopify/products/deleteProduct');

module.exports = {
    CreateProduct,
    GetToken,
    ShopifyConnect,
    FileUpload,
    GetSearchProduct,
    DeleteProduct,
};