import io from 'socket.io-client';

const socket = io('wss://taku.moe:2087', {
    auth: {
        token: localStorage.token
    }
});

socket.on('disconnect', function() {
    console.log("[MESSAGE WS] DISCONNECTED")
    socket.connect();
});

export default socket;