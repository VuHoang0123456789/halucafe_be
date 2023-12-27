const { ReturnItems, ChangeItem } = require('../../../until/method');
import { ChatType } from '../../../types/type_ob';

class ChatModel {
    async AddMessage(Chat: ChatType) {
        const query = `
            insert into chat(sender, receiver, msg, create_at, delete_at) 
            values ('${Chat.sender}', '${Chat.receiver}', '${Chat.msg}', '${Chat.create_at}', '${Chat.delete_at}')
        `;
        const error = 'Error in Chatmodel/AddMessage';
        return await ChangeItem(query, error);
    }

    async GetAllMessage(sender: string, receiver: string, limit: number) {
        const query = `
            select * from chat 
            where 
                SPLIT_PART(cast(create_at as varchar), ' ', 1) in (
                    select DISTINCT SPLIT_PART(cast(create_at as varchar), ' ', 1) as create_at
                    from chat
                    where sender = 'vuhuyhoang2104@gmail.com' and receiver = 'hallu-coffee'
                    order by create_at desc
                    limit ${limit}
                ) and
                sender = '${sender}' and receiver = '${receiver}' or 
                sender = '${receiver}' and receiver = '${sender}'
            order by create_at desc;
        `;

        const error = 'Error in Chatmodel/AddMessage';

        const chats = await ReturnItems(query, error);

        const ReverseChats = [];

        for (let i = chats.length - 1; i >= 0; i--) {
            ReverseChats.push(chats[i]);
        }

        return ReverseChats;
    }
}

module.exports = new ChatModel();

export {};
