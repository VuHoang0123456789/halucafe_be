import { Request, Response } from 'express';
const postsModel = require('../../model/posts');

class PostsController {
    //[GET]: /posts/get-all-posts?page_index=?&limit=?
    async GetAllPosts(req: Request, res: Response) {
        try {
            const page_index = req.query.page_index;
            const limit = req.query.limit;
            const posts = await postsModel.GetAllPosts(page_index, limit);

            if (!posts) return res.status(400).json({ msg: 'bad quest' });

            if (posts.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(posts);
        } catch (error) {
            console.log('Error in PostsController/GetAllPosts');
            return res.status(500).json('Internal Server');
        }
    }

    //[GET]: /posts/get-posts-related?limit=?
    async GetRelatedPosts(req: Request, res: Response) {
        try {
            const slug = req.body.slug;
            const limit = req.query.limit;
            const post_author = req.body.post_author;

            const posts = await postsModel.GetRelatedPosts(post_author, slug, limit);

            if (!posts) return res.status(400).json({ msg: 'bad quest' });

            if (posts.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(posts);
        } catch (error) {
            console.log('Error in PostsController/GetRelatedPost');
            return res.status(500).json('Internal Server');
        }
    }

    //[GET]: /posts/get-post:slug
    async GetPost(req: Request, res: Response) {
        try {
            const slug = req.params.slug;
            const post = await postsModel.GetPost(slug);

            if (!post) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(post);
        } catch (error) {
            console.log('Error in PostsController/GetPost: ', error);
            return res.status(500).json('Internal Server');
        }
    }
}

module.exports = new PostsController();

export {};
