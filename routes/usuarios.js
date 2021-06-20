import express from 'express';
const router = express.Router();
import usuarios from '../server/controllers/usuarios.js';
import multerConfig from './../server/config/multer.js';
import multer from 'multer';

router
  .get('/', usuarios.onGetAllUsers)
  .post('/', usuarios.onCreateUser)
  .get('/:uuid', usuarios.onGetUserByID)
  .patch('/', usuarios.onEditUserByID)
  .delete('/', usuarios.onDeleteUserByID)

export default router;
