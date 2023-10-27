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
const postsModel = require('../../model/posts');
class PostsController {
    //[GET]: /posts/get-all-posts?page_index=?&limit=?
    GetAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page_index = req.query.page_index;
                const limit = req.query.limit;
                const posts = yield postsModel.GetAllPosts(page_index, limit);
                if (!posts)
                    return res.status(400).json({ msg: 'bad quest' });
                if (posts.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(posts);
            }
            catch (error) {
                console.log('Error in PostsController/GetAllPosts');
                return res.status(500).json('Internal Server');
            }
        });
    }
    //[GET]: /posts/get-posts-related?limit=?
    GetRelatedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.body.slug;
                const limit = req.query.limit;
                const post_author = req.body.post_author;
                const posts = yield postsModel.GetRelatedPosts(post_author, slug, limit);
                if (!posts)
                    return res.status(400).json({ msg: 'bad quest' });
                if (posts.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(posts);
            }
            catch (error) {
                console.log('Error in PostsController/GetRelatedPost');
                return res.status(500).json('Internal Server');
            }
        });
    }
    //[GET]: /posts/get-post:slug
    GetPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const post = yield postsModel.GetPost(slug);
                if (!post)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(post);
            }
            catch (error) {
                console.log('Error in PostsController/GetPost: ', error);
                return res.status(500).json('Internal Server');
            }
        });
    }
}
module.exports = new PostsController();
