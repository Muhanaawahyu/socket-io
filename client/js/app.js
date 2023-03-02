const socket = io();
const form = document.getElementById('chat-form');
const messages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const msgInput = document.getElementById('msg');
const typingMsg = document.getElementById('typing');
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('join', { username, room });

socket.on('room', ({ room, users }) => {
    outputRoom(room);
    // console.log(users[socket.id])
    outputUsers(users);
});

socket.on('welcome', message => {
    welcomeMsg(message);
    messages.scrollTop = messages.scrollHeight;
})

const welcomeMsg = (message) => {
    let div = document.createElement('div');
    div.classList.add('welcome-text');
    div.innerHTML = `
        <p class="text">${message}</p>
    `
    console.log(message)
    messages.appendChild(div);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.msg.value;
    socket.emit('chat-message', message);
    e.target.elements.msg.value = "";
});

socket.on('send', message => {
    removeTyping();
    outputSend(message);
    messages.scrollTop = messages.scrollHeight;
});

const outputSend = (message) => {
    removeTyping();
    if (message.username == username) {
        let div = document.createElement('div');
        div.classList.add('send-msg');
        div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.msg}</p>
    `
        messages.appendChild(div);
    };
};

socket.on('receive', message => {
    removeTyping();
    outputReceive(message);
    messages.scrollTop = messages.scrollHeight;
});

const outputReceive = (message) => {
    removeTyping();
    let div = document.createElement('div');
    div.classList.add('received-msg');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.msg}</p>
    `
    messages.appendChild(div);
};

msgInput.addEventListener('keypress', (e) => {
    if (msgInput.value.length > 0) {
        socket.emit('typing', {
            typing: `@ ${username} is typing`
        })
    } else {
        socket.emit('typing', {
            typing: ``
        });
    };
});

socket.on('typing', (data) => {
    removeTyping();
    const div = `
        <div class="typing-container">
            <p class="typing">${data.typing}</p>
        </div>    
    `
    typingMsg.innerHTML += div;
});

const removeTyping = () => {
    document.querySelectorAll('div.typing-container').forEach(typing => {
        typing.parentNode.removeChild(typing);
    });
};

const outputRoom = (room) => {
    roomName.innerText = room;
};

const outputUsers = (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        // const li = document.createElement('li');
        // li.classList.add('user-li');
        // li.innerHTML = `
        //     <p class=>${user.username}</p>
        // `;
        // userList.appendChild(li);

        let li = `
            <li class="user-li" >
            ${user.username}
            </li>
        `
        userList.innerHTML += li
    });
};

    const users = document.querySelectorAll('.user-li > p');
    
console.log(users)

    // users.forEach(user => {
    //     let p = user.querySelectorAll('p')
    //     p.forEach(x => {

    //         x.addEventListener('click', () => {
    //             console.log('fghj')
    //         })
    //     })
    // })

// users.forEach(user => {
//     user.addEventListener('click', (e) => {
//         console.log(e.target.innerText, 'aoskoakso');
//         alert('rytuhu')
//     })
// })
// users.forEach(user => {
//     console.log(user)
//     user.addEventListener('click', (e) => {
//         e.preventDefault()
//         alert('aaa')
//         let profil = document.createElement('div')
//         profil.classList.add('profil');
//         profil.innerHTML = `
//         <p class="profil-name">${user}asdfgj</p>
//         `
//         messages.appendChild(profil)
//     })
// })
