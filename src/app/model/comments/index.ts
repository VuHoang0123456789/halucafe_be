const { ChangeItem, ReturnItems } = require('../../../until/method');
import { CommentsType, feedbackType } from '../../../types/type_ob';

class CommentModel {
    async AddNewComment(comment: CommentsType) {
        const query = `
            insert into list_comment_lv1 (customer_id, note, create_at, slug) 
            values (
                '${comment.author_id}', '${comment.note}', '${comment.create_at}', '${comment.slug}'
            )
        `;
        const error = 'Error in CommentModel/AddNewComment';

        return await ChangeItem(query, error);
    }

    async AddNewFeedBack(feedback: feedbackType) {
        const query = `call add_new_feedback(row(${feedback.author_id}, '${feedback.note}', ${feedback.comment_id}, '${feedback.create_at}', ${feedback.receiver_id}))`;
        const error = 'Error in CommentModel/AddNewFeedBack';

        return await ChangeItem(query, error);
    }

    async GetComments(post_slug: string, customer_id: number) {
        const error = 'Error in CommentModel/GetComments';
        const query = `
            select 
                comment_id_lv1 as comment_id, note, update_at, create_at, slug, 
                customer.customer_id as author_id, customer.full_name as author_name,
                (select count(*) from like_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1) as like_count,
                (select count(*) from dislike_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1) as dislike_count,
                (select count(*) from like_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1 and customer_id = ${customer_id}) as is_like,
				(select count(*) from dislike_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1 and customer_id = ${customer_id}) as is_dislike
            from 
                list_comment_lv1 join customer on customer.customer_id = list_comment_lv1.customer_id 
            where 
                slug = '${post_slug}'
            order by create_at desc;
        `;

        const commentNoFeedback = (await ReturnItems(query, error)) as CommentsType[];

        for (let i = 0; i < commentNoFeedback.length; i++) {
            const queryFeedBack = `
                select 
                    list_comment_lv2.comment_id_lv2 as feedback_of_comment_id, comment_id_lv1 as comment_id, 
                    note, update_at, create_at, customer.customer_id as author_id, customer.full_name as author_name,
                    (select count(*) from like_of_comment where comment_id_lv2 = comment_id_lv2) as like_count,
                    (select count(*) from dislike_of_comment where comment_id_lv2 = comment_id_lv2) as dislike_count,
                    receiver_feedback.customer_id as receiver_id, 
                    (select full_name from customer where customer_id = receiver_feedback.customer_id) as receiver_name,
                    (select count(*) from like_of_comment where comment_id_lv2 = list_comment_lv2.comment_id_lv2 and customer_id = ${customer_id}) as is_like,
                    (select count(*) from dislike_of_comment where comment_id_lv2 = list_comment_lv2.comment_id_lv2 and customer_id = ${customer_id}) as is_dislike
                from 
                    list_comment_lv2 join customer on customer.customer_id = list_comment_lv2.customer_id
                    join receiver_feedback on receiver_feedback.comment_id_lv2 = list_comment_lv2.comment_id_lv2
                where comment_id_lv1 = '${commentNoFeedback[i].comment_id}'
                order by create_at desc;
            `;

            commentNoFeedback[i].feebacks = [...(await ReturnItems(queryFeedBack, error))];
        }

        return commentNoFeedback;
    }

    async DislikeOrLike(comment_id: number, customer_id: number, is_dislike: string) {
        const query = `call dislike_or_like('${comment_id}', ${customer_id}, '${is_dislike}')`;
        const error = 'Error in CommentModel/DislikeOrLike';

        return await ChangeItem(query, error);
    }

    async LikeOrDislike(comment_id: number, customer_id: number, is_like: string) {
        const query = `call like_or_dislike('${comment_id}', ${customer_id}, '${is_like}')`;
        const error = 'Error in CommentModel/LikeOrDislike';

        return await ChangeItem(query, error);
    }
}

module.exports = new CommentModel();

export {};
