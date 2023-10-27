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
const ChatModel = require('../../model/chat');
class ChatController {
    AddNewMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Chat = req.body;
                const isAdd = yield ChatModel.AddMessage(Chat);
                if (!isAdd)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(201).json({ msg: 'Gửi tin nhắn thành công.' });
            }
            catch (error) {
                console.log('Error in ChatController/ AddNewMessage');
                return res.status(500).json({ msg: 'Internal Server' });
            }
        });
    }
    GetAllMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sender = req.body.sender;
                const receiver = req.body.receiver;
                const chats = yield ChatModel.GetAllMessage(sender, receiver);
                if (chats.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                if (!chats)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(200).json(chats);
            }
            catch (error) {
                console.log('Error in ChatController/ GetAllMessage');
                return res.status(500).json({ msg: 'Internal Server' });
            }
        });
    }
}
module.exports = new ChatController();
