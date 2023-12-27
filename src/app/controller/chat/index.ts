import { Request, Response } from 'express';
import { ChatType } from '../../../types/type_ob';
const ChatModel = require('../../model/chat');

class ChatController {
    async AddNewMessage(req: Request, res: Response) {
        try {
            const Chat: ChatType = req.body;

            const isAdd = await ChatModel.AddMessage(Chat);

            if (!isAdd) return res.status(400).json({ msg: 'bad quest' });

            return res.status(201).json({ msg: 'Gửi tin nhắn thành công.' });
        } catch (error) {
            console.log('Error in ChatController/ AddNewMessage');
            return res.status(500).json({ msg: 'Internal Server' });
        }
    }

    async GetAllMessage(req: Request, res: Response) {
        try {
            const sender = req.body.sender;
            const receiver = req.body.receiver;
            const limit = req.query.limit;

            const chats = await ChatModel.GetAllMessage(sender, receiver, limit);
            if (chats.length === 0) return res.status(204).json({ msg: 'no content' });

            if (!chats) return res.status(400).json({ msg: 'bad quest' });

            return res.status(200).json(chats);
        } catch (error) {
            console.log('Error in ChatController/ GetAllMessage');
            return res.status(500).json({ msg: 'Internal Server' });
        }
    }
}

module.exports = new ChatController();
