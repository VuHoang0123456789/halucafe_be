const Router = require('express').Router();
const commentsController = require('../app/controller/comments');
const { auth } = require('../auth/authMiddleware');

Router.get('/get-all-comment/', commentsController.GetComments);
Router.post('/add-new-comment', auth, commentsController.AddNewComment);
Router.post('/like-or-dislike', auth, commentsController.LikeOrDislike);
Router.post('/dislike-of-like', auth, commentsController.DislikeOrLike);
Router.post('/add-new-feedback', auth, commentsController.AddNewFeedBack);

module.exports = Router;

export {};