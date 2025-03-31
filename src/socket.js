
import { io } from 'socket.io-client';

const socket = io('https://mr-ds-2.onrender.com', {
  transports: ['websocket'],
});

export default socket;
