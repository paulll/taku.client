import io from 'socket.io-client';

const socket = io('wss://taku.moe:2087', {
    auth: {
        token: localStorage.token
    }
});

export default socket;