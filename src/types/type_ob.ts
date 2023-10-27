export interface ChatType {
    chat_id?: number;
    sender: string;
    receiver: string;
    msg: string;
    create_at: string;
    delete_at?: string;
}

export interface BookTableType {
    full_name: string;
    phone: string;
    date: string;
    time: string;
    note: string;
}

export interface CommentsType {
    comment_id?: number;
    author_id: number;
    author_name?: string;
    note: string;
    update_at?: string;
    create_at: string;
    slug: string;
    dislike_count?: number;
    like_count?: number;
    is_like?: number;
    is_dislike?: number;
    feebacks?: feedbackType[];
}

export interface feedbackType {
    feedback_of_comment_id?: number;
    author_id: number;
    author_name?: string;
    note: string | null;
    comment_id: number;
    create_at: string;
    update_at?: string;
    dislike_count?: number;
    like_count?: number;
    receiver_id: number;
    receiver_name?: string;
    is_like?: number;
    is_dislike?: number;
}
