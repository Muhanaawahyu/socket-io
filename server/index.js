const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const formatMessage = require('../utils/messages');
const { userJoin, currentUser, userLeft, userRoom } = require('../utils/users');

const app = express();
const server = http.createServer(app);
let PORT = process.env.PORT || 3000;
const io = new Server(server);

app.use(express.static(__dirname + '/../client'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '../client/index.html');
});
const bot = 'BOT_COEK';

const users = {}

io.on('connection', (socket) => {

    socket.on('join', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        users[socket.id] = {
            id: socket.id,
            username: username,
            room: room
        };

        socket.join(users[socket.id].room);
        socket.emit('welcome', `${users[socket.id].username} welcome to ${users[socket.id].room}`);
        socket.broadcast.to(user.room).emit('welcome', `${users[socket.id].username} join the chat`);

        io.to(users[socket.id].room).emit('room', {
            room: users[socket.id].room,
            users: userRoom(users[socket.id].room)
        });
    });

    socket.on('chat-message', (message) => {
        const user = currentUser(socket.id);
        io.to(users[socket.id].room).emit('send', formatMessage(users[socket.id].id, users[socket.id].username, message));
        socket.broadcast.to(users[socket.id].room).emit('receive', formatMessage(users[socket.id].id, users[socket.id].username, message));
    });

    socket.on('disconnect', () => {
        const user = userLeft(socket.id);

        if (user) {
            io.to(users[socket.id].room).emit('welcome', `${users[socket.id].username} left the chat`);

            io.to(users[socket.id].room).emit('room', {
                room: users[socket.id].room,
                users: userRoom(users[socket.id].room)
            });
        };
    });

    socket.on('typing', (data) => {
        socket.broadcast.to(users[socket.id].room).emit('typing', data);
    });

    socket.on('error', () => {
        console.log('my error', 'Something wrong');
    });

});

server.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});