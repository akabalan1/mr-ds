
import { io } from 'socket.io-client';

const socket = io('https://mr-ds-3.onrender.com', {
  transports: ['websocket']
});

export default socket;
