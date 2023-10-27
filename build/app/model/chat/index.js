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
const { ReturnItems, ChangeItem } = require('../../../until/method');
class ChatModel {
    AddMessage(Chat) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            insert into chat(sender, receiver, msg, create_at, delete_at) 
            values ('${Chat.sender}', '${Chat.receiver}', '${Chat.msg}', '${Chat.create_at}', '${Chat.delete_at}')
        `;
            const error = 'Error in Chatmodel/AddMessage';
            return yield ChangeItem(query, error);
        });
    }
    GetAllMessage(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            select * from chat 
            where 
                sender = '${sender}' and receiver = '${receiver}' or 
                sender = '${receiver}' and receiver = '${sender}' 
            order by create_at asc
        `;
            const error = 'Error in Chatmodel/AddMessage';
            return yield ReturnItems(query, error);
        });
    }
}
module.exports = new ChatModel();
