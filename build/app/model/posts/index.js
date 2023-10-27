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
const { ReturnItems, ReturnItem } = require('../../../until/method');
class PostsModel {
    GetAllPosts(pageIndex, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `select *, (select count(*) from posts) as max_row from posts limit ${limit} offset ${pageIndex};`;
                const error = 'Error in PostsModel/GetAllPosts';
                return yield ReturnItems(query, error);
            }
            catch (error) {
                console.log('Error in PostsModel/GetAllPosts');
                return null;
            }
        });
    }
    GetRelatedPosts(post_author, slug, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `select * from posts where post_author = '${post_author}' and slug != '${slug}' limit ${limit};`;
                const error = 'Error in PostsModel/GetRelatedPosts';
                return yield ReturnItems(query, error);
            }
            catch (error) {
                console.log('Error in PostsModel/GetRelatedPosts');
                return null;
            }
        });
    }
    GetPost(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `select * from posts where slug = '${slug}'`;
                const error = 'Error in PostsModel/GetPosts';
                return yield ReturnItem(query, error);
            }
            catch (error) {
                console.log('Error in PostsModel/GetPosts');
                return null;
            }
        });
    }
}
module.exports = new PostsModel();
