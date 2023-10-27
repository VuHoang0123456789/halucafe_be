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

    async GetAllMessage(sender: string, receiver: string) {
        const query = `
            select * from chat 
            where 
                sender = '${sender}' and receiver = '${receiver}' or 
                sender = '${receiver}' and receiver = '${sender}' 
            order by create_at asc
        `;
        const error = 'Error in Chatmodel/AddMessage';

        return await ReturnItems(query, error);
    }
}

module.exports = new ChatModel();

export {};
