import express from 'express';
// controllers
import chatRoom from '../../server/controllers/chatRoom.js';

const router = express.Router();

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/:roomId/message', chatRoom.postMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)
  .delete('/:id_message', chatRoom.deleteMessage)

export default router;
