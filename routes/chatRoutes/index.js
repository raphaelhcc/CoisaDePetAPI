import express from 'express';
// middlewares
import { encode } from '../../server/middlewares/jwt.js';

const router = express.Router();

router
  .post('/login/:uuid', encode, (req, res, next) => {
    return res
      .status(200)
      .json({
        success: true,
        authorization: req.authToken,
      });
  });

export default router;
