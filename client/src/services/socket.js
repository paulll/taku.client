import io from 'socket.io-client';

const socket = io('ws://taku.moe:8880', {
    auth: {
        token: localStorage.token
    }
});

export default socket;