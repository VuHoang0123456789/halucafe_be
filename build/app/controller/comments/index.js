"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentsModel = require('../../model/comments');
class CommentsController {
    AddNewComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = req.body;
                const isAdd = yield commentsModel.AddNewComment(comment);
                if (!isAdd)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(201).json({ msg: 'successfull' });
            }
            catch (error) {
                console.log('Error in CommentsController/AddNewComments: ', error);
            }
        });
    }
    AddNewFeedBack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = req.body;
                const isAdd = yield commentsModel.AddNewFeedBack(feedback);
                if (!isAdd)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(201).json({ msg: 'successfull' });
            }
            catch (error) {
                console.log('Error in CommentsController/AddNewFeedBack: ', error);
            }
        });
    }
    GetComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post_slug = req.query.post_slug;
                const customer_id = req.query.customer_id;
                const comments = yield commentsModel.GetComments(post_slug, customer_id);
                if (!comments)
                    return res.status(400).json({ msg: 'bad quest' });
                if (comments.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(comments);
            }
            catch (error) {
                console.log('Error in CommentsController/GetComments: ', error);
            }
        });
    }
    LikeOrDislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment_id = req.body.comment_id;
                const customer_id = req.body.customer_id;
                const is_like = req.body.is_like;
                const isLike = yield commentsModel.LikeOrDislike(comment_id, customer_id, is_like);
                if (!isLike)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(200).json({ msg: 'successfull' });
            }
            catch (error) {
                console.log('Error in CommentsController/LikeComment: ', error);
            }
        });
    }
    DislikeOrLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment_id = req.body.comment_id;
                const customer_id = req.body.customer_id;
                const is_dislike = req.body.is_dislike;
                const isDisLike = yield commentsModel.DislikeOrLike(comment_id, customer_id, is_dislike);
                if (!isDisLike)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(200).json({ msg: 'successfull' });
            }
            catch (error) {
                console.log('Error in CommentsController/DisLikeComment: ', error);
            }
        });
    }
}
module.exports = new CommentsController();
