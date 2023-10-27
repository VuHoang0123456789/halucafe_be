"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const CategoryController = require('../app/controller/category');
router.get('/get-categorys', CategoryController.GetAllCategory);
module.exports = router;
