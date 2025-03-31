
import { io } from 'socket.io-client';

const socket = io('https://mr-ds.onrender.com', {
  transports: ['websocket']
});

export default socket;
