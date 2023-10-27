"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('express').Router();
const postsController = require('../app/controller/posts');
Router.get('/get-all-posts/', postsController.GetAllPosts);
Router.post('/get-posts-related/', postsController.GetRelatedPosts);
Router.get('/get-post/:slug', postsController.GetPost);
module.exports = Router;
