"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('express').Router();
const ChatController = require('../app/controller/chat');
const { auth } = require('../auth/authMiddleware');
Router.post('/get-all-message', auth, ChatController.GetAllMessage);
Router.post('/add-new-message', auth, ChatController.AddNewMessage);
module.exports = Router;
