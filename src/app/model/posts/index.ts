const { ReturnItems, ReturnItem } = require('../../../until/method');

class PostsModel {
    async GetAllPosts(pageIndex: number, limit: number) {
        try {
            const query = `select *, (select count(*) from posts) as max_row from posts limit ${limit} offset ${pageIndex};`;
            const error = 'Error in PostsModel/GetAllPosts';

            return await ReturnItems(query, error);
        } catch (error) {
            console.log('Error in PostsModel/GetAllPosts');
            return null;
        }
    }

    async GetRelatedPosts(post_author: string, slug: string, limit: number) {
        try {
            const query = `select * from posts where post_author = '${post_author}' and slug != '${slug}' limit ${limit};`;
            const error = 'Error in PostsModel/GetRelatedPosts';

            return await ReturnItems(query, error);
        } catch (error) {
            console.log('Error in PostsModel/GetRelatedPosts');
            return null;
        }
    }

    async GetPost(slug: string) {
        try {
            const query = `select * from posts where slug = '${slug}'`;
            const error = 'Error in PostsModel/GetPosts';

            return await ReturnItem(query, error);
        } catch (error) {
            console.log('Error in PostsModel/GetPosts');
            return null;
        }
    }
}

module.exports = new PostsModel();

export {};
