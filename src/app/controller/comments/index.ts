import { Request, Response } from 'express';
import { CommentsType, feedbackType } from '../../../types/type_ob';
const commentsModel = require('../../model/comments');

class CommentsController {
    async AddNewComment(req: Request, res: Response) {
        try {
            const comment = req.body as CommentsType;
            const isAdd = await commentsModel.AddNewComment(comment);

            if (!isAdd) return res.status(400).json({ msg: 'bad quest' });

            return res.status(201).json({ msg: 'successfull' });
        } catch (error) {
            console.log('Error in CommentsController/AddNewComments: ', error);
        }
    }

    async AddNewFeedBack(req: Request, res: Response) {
        try {
            const feedback = req.body as feedbackType;
            const isAdd = await commentsModel.AddNewFeedBack(feedback);

            if (!isAdd) return res.status(400).json({ msg: 'bad quest' });

            return res.status(201).json({ msg: 'successfull' });
        } catch (error) {
            console.log('Error in CommentsController/AddNewFeedBack: ', error);
        }
    }

    async GetComments(req: Request, res: Response) {
        try {
            const post_slug = req.query.post_slug;
            const customer_id = req.query.customer_id;
            const comments = await commentsModel.GetComments(post_slug, customer_id);

            if (!comments) return res.status(400).json({ msg: 'bad quest' });
            if (comments.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(comments);
        } catch (error) {
            console.log('Error in CommentsController/GetComments: ', error);
        }
    }

    async LikeOrDislike(req: Request, res: Response) {
        try {
            const comment_id = req.body.comment_id;
            const customer_id = req.body.customer_id;
            const is_like = req.body.is_like;

            const isLike = await commentsModel.LikeOrDislike(comment_id, customer_id, is_like);

            if (!isLike) return res.status(400).json({ msg: 'bad quest' });

            return res.status(200).json({ msg: 'successfull' });
        } catch (error) {
            console.log('Error in CommentsController/LikeComment: ', error);
        }
    }

    async DislikeOrLike(req: Request, res: Response) {
        try {
            const comment_id = req.body.comment_id;
            const customer_id = req.body.customer_id;
            const is_dislike = req.body.is_dislike;

            const isDisLike = await commentsModel.DislikeOrLike(comment_id, customer_id, is_dislike);

            if (!isDisLike) return res.status(400).json({ msg: 'bad quest' });

            return res.status(200).json({ msg: 'successfull' });
        } catch (error) {
            console.log('Error in CommentsController/DisLikeComment: ', error);
        }
    }
}

module.exports = new CommentsController();

export {};
