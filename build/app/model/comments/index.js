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
const { ChangeItem, ReturnItems } = require('../../../until/method');
class CommentModel {
    AddNewComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            insert into list_comment_lv1 (customer_id, note, create_at, slug) 
            values (
                '${comment.author_id}', '${comment.note}', '${comment.create_at}', '${comment.slug}'
            )
        `;
            const error = 'Error in CommentModel/AddNewComment';
            return yield ChangeItem(query, error);
        });
    }
    AddNewFeedBack(feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `call add_new_feedback(row(${feedback.author_id}, '${feedback.note}', '${feedback.comment_id}', '${feedback.create_at}', ${feedback.receiver_id}))`;
            console.log(query);
            const error = 'Error in CommentModel/AddNewFeedBack';
            return yield ChangeItem(query, error);
        });
    }
    GetComments(post_slug, customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = 'Error in CommentModel/GetComments';
            const query = `
            select 
                comment_id_lv1 as comment_id, note, update_at, create_at, slug, 
                customer.customer_id as author_id, customer.full_name as author_name, avatar,
                (select count(*) from like_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1) as like_count,
                (select count(*) from dislike_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1) as dislike_count,
                (select count(*) from like_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1 and customer_id = ${customer_id}) as is_like,
				(select count(*) from dislike_of_comment where comment_id_lv1 = list_comment_lv1.comment_id_lv1 and customer_id = ${customer_id}) as is_dislike
            from 
                list_comment_lv1 join customer on customer.customer_id = list_comment_lv1.customer_id
                join account on customer.email = account.email
            where 
                slug = '${post_slug}'
            order by create_at desc;
        `;
            const commentNoFeedback = (yield ReturnItems(query, error));
            for (let i = 0; i < commentNoFeedback.length; i++) {
                const queryFeedBack = `
                select 
                    list_comment_lv2.comment_id_lv2 as feedback_of_comment_id, comment_id_lv1 as comment_id, 
                    note, update_at, create_at, customer.customer_id as author_id, customer.full_name as author_name,
                    (select count(*) from like_of_comment where comment_id_lv2 = comment_id_lv2) as like_count,
                    (select count(*) from dislike_of_comment where comment_id_lv2 = comment_id_lv2) as dislike_count,
                    receiver_feedback.customer_id as receiver_id, avatar,
                    (select full_name from customer where customer_id = receiver_feedback.customer_id) as receiver_name,
                    (select count(*) from like_of_comment where comment_id_lv2 = list_comment_lv2.comment_id_lv2 and customer_id = ${customer_id}) as is_like,
                    (select count(*) from dislike_of_comment where comment_id_lv2 = list_comment_lv2.comment_id_lv2 and customer_id = ${customer_id}) as is_dislike
                from 
                    list_comment_lv2 join customer on customer.customer_id = list_comment_lv2.customer_id
                    join receiver_feedback on receiver_feedback.comment_id_lv2 = list_comment_lv2.comment_id_lv2
                    join account on customer.email = account.email
                where comment_id_lv1 = '${commentNoFeedback[i].comment_id}'
                order by create_at desc;
            `;
                commentNoFeedback[i].feebacks = [...(yield ReturnItems(queryFeedBack, error))];
            }
            return commentNoFeedback;
        });
    }
    DislikeOrLike(comment_id, customer_id, is_dislike) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `call dislike_or_like('${comment_id}', ${customer_id}, '${is_dislike}')`;
            const error = 'Error in CommentModel/DislikeOrLike';
            return yield ChangeItem(query, error);
        });
    }
    LikeOrDislike(comment_id, customer_id, is_like) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `call like_or_dislike('${comment_id}', ${customer_id}, '${is_like}')`;
            const error = 'Error in CommentModel/LikeOrDislike';
            return yield ChangeItem(query, error);
        });
    }
}
module.exports = new CommentModel();
