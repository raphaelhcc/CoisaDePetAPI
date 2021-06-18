// utils
import makeValidation from '@withvoid/make-validation';
// models
import ChatRoomModel, {
  CHAT_ROOM_TYPES
} from '../models/ChatRoom.js';
import ChatMessageModel from '../models/ChatMessage.js';
import UserModel from '../models/User.js';
import usuarios from '../controllers/usuarios.js';
import pool from '../../database.js';


export default {
  initiate: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          userIds: {
            type: types.array,
            options: {
              unique: true,
              empty: false,
              stringOnly: true
            }
          },
          type: {
            type: types.enum,
            options: {
              enum: CHAT_ROOM_TYPES
            }
          },
        }
      }));
      if (!validation.success) return res.status(400).json({
        ...validation
      });

      const {
        userIds,
        type
      } = req.body;
      const {
        userId: chatInitiator
      } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
      return res.status(200).json({
        success: '1',
        chatRoom
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const {
        id_message
      } = req.params;
      const deletea = await ChatMessageModel.deletePostInChatRoom(id_message);
      return res.status(200).json({
        success: 'sucesso',
        deletea
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,

      }).console.log('erro1')
    }
  },
  postMessage: async (req, res) => {
    try {
      const {
        roomId
      } = req.params;
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          messageText: {
            type: types.string
          },
        }
      }));
      if (!validation.success) return res.status(400).json({
        ...validation
      });

      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
      global.io.sockets.in(roomId).emit('new message', {
        message: post
      });
      return res.status(200).json({
        success: '2',
        post
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }
  },
  getRecentConversation: async (req, res) => {
    try {
      const currentLoggedUser = req.userId;
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
      const roomIds = rooms.map(room => room._id);
      const recentConversation = await ChatMessageModel.getRecentConversation(
        roomIds, options, currentLoggedUser
      );
      return res.status(200).json({
        success: '3',
        RoomIds: roomIds
        //        conversation: recentConversation
      });
      //      return res.status(200).json({
      //        success: '3',
      //        conversation: recentConversation
      //      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error
      })
    }
  },
  getConversationByRoomId: async (req, res) => {
    try {
      const {
        roomId
      } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      room.userIds = [room.userIds[0], room.userIds[1]]

      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }
      //const users = await usuarios.onGetUsersByIDs(room.userIds);

      pool.connect((err, client, done) => {
        if (err) {
          console.log(err)
        } else {
          client.query(
            'SELECT * FROM tb_usuario WHERE uuid = $1 OR uuid = $2;',
            room.userIds,
            async (err, result) => {
              done()
              const users = result
              const options = {
                page: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
              };
              const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);

              return res.status(200).json({
                success: '4',
                conversation,
                users,
              });

            }
          )
        }

      })

    } catch (error) {
      return res.status(500).json({
        success: 'ss',
        error
      });
    }
  },

  markConversationReadByRoomId: async (req, res) => {
    try {
      const {
        roomId
      } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }

      const currentLoggedUser = req.userId;
      const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
      return res.status(200).json({
        success: '7',
        data: result
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error
      });
    }
  },
}