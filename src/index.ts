import { Socket } from 'socket.io';
const express = require('express');
const dotenv = require('dotenv');
const MorganFunc = require('./config/morgan');
const Route = require('./router');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('../src/config/db');

//environment config
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; //port

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

//'logger
MorganFunc(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//router
Route(app);

//cookie-parser
app.use(cookieParser());

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const socketIo = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const onlineUser = new Map();

socketIo.on('connection', (socket: Socket) => {
    ///Handle khi có connect từ client tới
    console.log('New client connected: ' + socket.id);

    socket.emit('user-id', socket.id);

    socket.on('add-user', (userId: any) => {
        onlineUser.set(userId, socket.id);
    });

    socket.on('send-data-client', function (data: any) {
        // Handle khi có sự kiện tên là sendDataClient từ phía client
        const senUserSocket = onlineUser.get(data.to);

        if (!senUserSocket) return;

        socket.to(senUserSocket).emit('send-data-server', data.msg); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        socketIo.to(userToCall).emit('callUser', { signal: signalData, from, name });
    });

    socket.on('answerCall', (data) => {
        socketIo.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('disconnect', (data) => {
        console.log('Client disconnected: ', socket.id); // Khi client disconnect thì log ra terminal.
    });
});
