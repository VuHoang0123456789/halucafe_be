const Router = require('express').Router();
const tableController = require('../app/controller/table');

Router.post('/book-table', tableController.BookTable);

module.exports = Router;

export {};
